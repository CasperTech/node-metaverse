import {CommandsBase} from './CommandsBase';
import {UUID} from '../UUID';
import * as LLSD from '@caspertech/llsd';
import {Utils} from '../Utils';
import {AssetType, HTTPAssets, PacketFlags} from '../..';
import {PermissionMask} from '../../enums/PermissionMask';
import * as zlib from 'zlib';
import {ZlibOptions} from 'zlib';
import {Material} from '../public/Material';
import {Color4} from '../Color4';
import {TransferRequestMessage} from '../messages/TransferRequest';
import {TransferChannelType} from '../../enums/TransferChannelType';
import {TransferSourceType} from '../../enums/TransferSourceTypes';
import {TransferInfoMessage} from '../messages/TransferInfo';
import {Message} from '../../enums/Message';
import {Packet} from '../Packet';
import {TransferPacketMessage} from '../messages/TransferPacket';
import {TransferAbortMessage} from '../messages/TransferAbort';
import {TransferStatus} from '../../enums/TransferStatus';

export class AssetCommands extends CommandsBase
{
    async downloadAsset(type: HTTPAssets, uuid: UUID): Promise<Buffer>
    {
        const result = await this.currentRegion.caps.downloadAsset(uuid, type);
        if (result.toString('UTF-8').trim() === 'Not found!')
        {
            throw new Error('Asset not found');
        }
        else if (result.toString('UTF-8').trim() === 'Incorrect Syntax')
        {
            throw new Error('Invalid Syntax');
        }
        return result;
    }

    downloadInventoryAsset(itemID: UUID, ownerID: UUID, type: AssetType, priority: boolean,  objectID: UUID = UUID.zero(), assetID: UUID = UUID.zero(), outAssetID?: { assetID: UUID }): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            const transferParams = Buffer.allocUnsafe(100);
            let pos = 0;
            this.agent.agentID.writeToBuffer(transferParams, pos);
            pos = pos + 16;
            this.circuit.sessionID.writeToBuffer(transferParams, pos);
            pos = pos + 16;
            ownerID.writeToBuffer(transferParams, pos);
            pos = pos + 16;
            objectID.writeToBuffer(transferParams, pos);
            pos = pos + 16;
            itemID.writeToBuffer(transferParams, pos);
            pos = pos + 16;
            assetID.writeToBuffer(transferParams, pos);
            pos = pos + 16;
            transferParams.writeInt32LE(type, pos);

            const transferID = UUID.random();

            const msg = new TransferRequestMessage();
            msg.TransferInfo = {
                TransferID: transferID,
                ChannelType: TransferChannelType.Asset,
                SourceType: TransferSourceType.SimInventoryItem,
                Priority: 100.0 + (priority ? 1.0 : 0.0),
                Params: transferParams
            };

            this.circuit.sendMessage(msg, PacketFlags.Reliable);
            let gotInfo = true;
            let expectedSize = 0;
            const packets: {[key: number]: Buffer} = {};
            const subscription = this.circuit.subscribeToMessages([
                Message.TransferInfo,
                Message.TransferAbort,
                Message.TransferPacket
            ], (packet: Packet) =>
            {
                try
                {
                    switch (packet.message.id)
                    {
                        case Message.TransferPacket:
                        {
                            const messg = packet.message as TransferPacketMessage;
                            packets[messg.TransferData.Packet] = messg.TransferData.Data;
                            switch (messg.TransferData.Status)
                            {
                                case TransferStatus.Abort:
                                    throw new Error('Transfer Aborted');
                                case TransferStatus.Error:
                                    throw new Error('Error');
                                case TransferStatus.Skip:
                                    console.error('TransferPacket: Skip! not sure what this means');
                                    break;
                                case TransferStatus.InsufficientPermissions:
                                    throw new Error('Insufficient Permissions');
                                case TransferStatus.NotFound:
                                    throw new Error('Not Found');
                            }
                            break;
                        }
                        case Message.TransferInfo:
                        {
                            const messg = packet.message as TransferInfoMessage;
                            if (!messg.TransferInfo.TransferID.equals(transferID))
                            {
                                return;
                            }
                            const status = messg.TransferInfo.Status as TransferStatus;
                            switch (status)
                            {
                                case TransferStatus.OK:
                                    expectedSize = messg.TransferInfo.Size;
                                    gotInfo = true;
                                    if (outAssetID !== undefined)
                                    {
                                        outAssetID.assetID = new UUID(messg.TransferInfo.Params, 80);
                                    }
                                    break;
                                case TransferStatus.Abort:
                                    throw new Error('Transfer Aborted');
                                case TransferStatus.Error:
                                    throw new Error('Error');
                                    // See if we get anything else
                                    break;
                                case TransferStatus.Skip:
                                    console.error('TransferInfo: Skip! not sure what this means');
                                    break;
                                case TransferStatus.InsufficientPermissions:
                                    throw new Error('Insufficient Permissions');
                                case TransferStatus.NotFound:
                                    throw new Error('Not Found');
                            }

                            break;
                        }
                        case Message.TransferAbort:
                        {
                            console.log('GOT TRANSFERABORT');
                            const messg = packet.message as TransferAbortMessage;
                            if (!messg.TransferInfo.TransferID.equals(transferID))
                            {
                                return;
                            }
                            throw new Error('Transfer Aborted');
                        }
                    }
                    if (gotInfo)
                    {
                        let gotSize = 0;
                        for (const packetNum of Object.keys(packets))
                        {
                            const pn: number = parseInt(packetNum, 10);
                            gotSize += packets[pn].length;
                        }
                        if (gotSize >= expectedSize)
                        {
                            const packetNumbers = Object.keys(packets).sort();
                            const buffers = [];
                            for (const pn of packetNumbers)
                            {
                                buffers.push(packets[parseInt(pn, 10)]);
                            }
                            subscription.unsubscribe();
                            resolve(Buffer.concat(buffers));
                        }
                    }
                }
                catch (error)
                {
                    subscription.unsubscribe();
                    reject(error);
                }
            })
        });
    }

    private getMaterialsLimited(uuidArray: any[], uuids: {[key: string]: Material | null}): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            const binary = LLSD.LLSD.formatBinary(uuidArray);
            const options: ZlibOptions = {
                level: 9
            };
            zlib.deflate(Buffer.from(binary.toArray()), options, async (error: Error | null, res: Buffer) =>
            {
                if (error)
                {
                    reject(error);
                    return;
                }
                const result = await this.currentRegion.caps.capsRequestXML('RenderMaterials', {
                    'Zipped': new LLSD.LLSD.asBinary(res.toString('base64'))
                }, false);

                const resultZipped = Buffer.from(result['Zipped'].octets);
                zlib.inflate(resultZipped, async (err: Error | null, reslt: Buffer) =>
                {
                    if (err)
                    {
                        reject(error);
                        return;
                    }
                    const binData = new LLSD.Binary(Array.from(reslt), 'BASE64');
                    const obj = LLSD.LLSD.parseBinary(binData);
                    if (obj.length > 0)
                    {
                        for (const mat of obj)
                        {
                            if (mat['ID'])
                            {
                                const nbuf = Buffer.from(mat['ID'].toArray());
                                const nuuid = new UUID(nbuf, 0).toString();
                                if (uuids[nuuid] !== undefined)
                                {
                                    if (mat['Material'])
                                    {
                                        const material = new Material();
                                        material.alphaMaskCutoff = mat['Material']['AlphaMaskCutoff'];
                                        material.diffuseAlphaMode = mat['Material']['DiffuseAlphaMode'];
                                        material.envIntensity = mat['Material']['EnvIntensity'];
                                        material.normMap = new UUID(mat['Material']['NormMap'].toString());
                                        material.normOffsetX = mat['Material']['NormOffsetX'];
                                        material.normOffsetY = mat['Material']['NormOffsetY'];
                                        material.normRepeatX = mat['Material']['NormRepeatX'];
                                        material.normRepeatY = mat['Material']['NormRepeatY'];
                                        material.normRotation = mat['Material']['NormRotation'];
                                        material.specColor = new Color4(mat['Material']['SpecColor'][0], mat['Material']['SpecColor'][1], mat['Material']['SpecColor'][2], mat['Material']['SpecColor'][3]);
                                        material.specExp = mat['Material']['SpecExp'];
                                        material.specMap = new UUID(mat['Material']['SpecMap'].toString());
                                        material.specOffsetX = mat['Material']['SpecOffsetX'];
                                        material.specOffsetY = mat['Material']['SpecOffsetY'];
                                        material.specRepeatX = mat['Material']['SpecRepeatX'];
                                        material.specRepeatY = mat['Material']['SpecRepeatY'];
                                        material.specRotation = mat['Material']['SpecRotation'];
                                        material.llsd = LLSD.LLSD.formatXML(mat['Material']);
                                        uuids[nuuid] = material;
                                    }
                                }
                            }
                        }
                        resolve();
                    }
                    else
                    {
                        reject(new Error('Material data not found'));
                    }
                });
            });
        });
    }

    async getMaterials(uuids: {[key: string]: Material | null}): Promise<void>
    {
        let uuidArray: any[] = [];
        let submittedUUIDS: {[key: string]: Material | null} = {};
        for (const uuid of Object.keys(uuids))
        {
            if (uuidArray.length > 32)
            {
                try
                {
                    await this.getMaterialsLimited(uuidArray, submittedUUIDS);
                    let resolvedCount = 0;
                    let totalCount = 0;
                    for (const uu of Object.keys(submittedUUIDS))
                    {
                        if (submittedUUIDS[uu] !== null)
                        {
                            resolvedCount++;
                            uuids[uu] = submittedUUIDS[uu];
                        }
                        totalCount++;
                    }
                    console.log('Resolved ' + resolvedCount + ' of ' + totalCount + ' materials');

                }
                catch (error)
                {
                    console.error(error);
                }
                uuidArray = [];
                submittedUUIDS = {};
            }
            if (!submittedUUIDS[uuid])
            {
                submittedUUIDS[uuid] = uuids[uuid];
                uuidArray.push(new LLSD.Binary(Array.from(new UUID(uuid).getBuffer())))
            }
        }
        try
        {
            await this.getMaterialsLimited(uuidArray, submittedUUIDS);
            let resolvedCount = 0;
            let totalCount = 0;
            for (const uu of Object.keys(submittedUUIDS))
            {
                if (submittedUUIDS[uu] !== null)
                {
                    resolvedCount++;
                    uuids[uu] = submittedUUIDS[uu];
                }
                totalCount++;
            }
            console.log('Resolved ' + resolvedCount + ' of ' + totalCount + ' materials (end)');
        }
        catch (error)
        {
            console.error(error);
        }
    }

    uploadAsset(type: HTTPAssets, data: Buffer, name: string, description: string): Promise<UUID>
    {
        return new Promise<UUID>((resolve, reject) =>
        {
            if (this.agent && this.agent.inventory && this.agent.inventory.main && this.agent.inventory.main.root)
            {
                this.currentRegion.caps.capsRequestXML('NewFileAgentInventory', {
                    'folder_id': new LLSD.UUID(this.agent.inventory.main.root.toString()),
                    'asset_type': type,
                    'inventory_type': Utils.HTTPAssetTypeToInventoryType(type),
                    'name': name,
                    'description': description,
                    'everyone_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'group_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'next_owner_mask': (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19),
                    'expected_upload_cost': 0
                }).then((response: any) =>
                {
                    if (response['state'] === 'upload')
                    {
                        const uploadURL = response['uploader'];
                        this.currentRegion.caps.capsRequestUpload(uploadURL, data).then((responseUpload: any) =>
                        {
                            resolve(new UUID(responseUpload['new_asset'].toString()));
                        }).catch((err) =>
                        {
                            reject(err);
                        });
                    }
                }).catch((err) =>
                {
                    console.log(err);
                })
            }
        });
    }
}
