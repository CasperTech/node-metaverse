import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import * as LLSD from '@caspertech/llsd';
import { Utils } from '../Utils';
import { PermissionMask } from '../../enums/PermissionMask';
import * as zlib from 'zlib';
import { ZlibOptions } from 'zlib';
import { Color4 } from '../Color4';
import { TransferRequestMessage } from '../messages/TransferRequest';
import { TransferChannelType } from '../../enums/TransferChannelType';
import { TransferSourceType } from '../../enums/TransferSourceTypes';
import { TransferInfoMessage } from '../messages/TransferInfo';
import { Message } from '../../enums/Message';
import { Packet } from '../Packet';
import { TransferPacketMessage } from '../messages/TransferPacket';
import { TransferAbortMessage } from '../messages/TransferAbort';
import { AssetType } from '../../enums/AssetType';
import { PacketFlags } from '../../enums/PacketFlags';
import { TransferStatus } from '../../enums/TransferStatus';
import { Material } from '../public/Material';
import { LLMesh } from '../public/LLMesh';
import { FolderType } from '../../enums/FolderType';
import { HTTPAssets } from '../../enums/HTTPAssets';

export class AssetCommands extends CommandsBase
{
    async downloadAsset(type: HTTPAssets, uuid: UUID | string): Promise<Buffer>
    {
        if (typeof uuid === 'string')
        {
            uuid = new UUID(uuid);
        }
        try
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
        catch (error)
        {
            // Fall back to old asset transfer
            const transferParams = Buffer.allocUnsafe(20);
            uuid.writeToBuffer(transferParams, 0);
            transferParams.writeInt32LE(parseInt(type, 10), 16);
            return this.transfer(TransferChannelType.Asset, TransferSourceType.Asset, false, transferParams);
        }
    }

    transfer(channelType: TransferChannelType, sourceType: TransferSourceType, priority: boolean, transferParams: Buffer, outAssetID?: { assetID: UUID }): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            const transferID = UUID.random();
            const msg = new TransferRequestMessage();
            msg.TransferInfo = {
                TransferID: transferID,
                ChannelType: channelType,
                SourceType: sourceType,
                Priority: 100.0 + (priority ? 1.0 : 0.0),
                Params: transferParams
            };

            this.circuit.sendMessage(msg, PacketFlags.Reliable);
            let gotInfo = true;
            let expectedSize = 0;
            const packets: { [key: number]: Buffer } = {};
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
                                    subscription.unsubscribe();
                                    reject(new Error('Transfer Aborted'));
                                    break;
                                case TransferStatus.Error:
                                    subscription.unsubscribe();
                                    reject(new Error('Error'));
                                    break;
                                case TransferStatus.Skip:
                                    console.error('TransferPacket: Skip! not sure what this means');
                                    break;
                                case TransferStatus.InsufficientPermissions:
                                    subscription.unsubscribe();
                                    reject(new Error('Insufficient Permissions'));
                                    break;
                                case TransferStatus.NotFound:
                                    subscription.unsubscribe();
                                    reject(new Error('Not Found'));
                                    break;
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
                                    subscription.unsubscribe();
                                    reject(new Error('Transfer Aborted'));
                                    break;
                                case TransferStatus.Error:
                                    subscription.unsubscribe();
                                    reject(new Error('Error'));
                                    // See if we get anything else
                                    break;
                                case TransferStatus.Skip:
                                    console.error('TransferInfo: Skip! not sure what this means');
                                    break;
                                case TransferStatus.InsufficientPermissions:
                                    subscription.unsubscribe();
                                    reject(new Error('Insufficient Permissions'));
                                    break;
                                case TransferStatus.NotFound:
                                    subscription.unsubscribe();
                                    reject(new Error('Not Found'));
                                    break;
                            }

                            break;
                        }
                        case Message.TransferAbort:
                        {
                            const messg = packet.message as TransferAbortMessage;
                            if (!messg.TransferInfo.TransferID.equals(transferID))
                            {
                                return;
                            }
                            subscription.unsubscribe();
                            reject(new Error('Transfer Aborted'));
                            return;
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
                            const packetNumbers = Object.keys(packets).sort((a: string, b: string): number =>
                            {
                                return parseInt(a, 10) - parseInt(b, 10);
                            });
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
            });
        });
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

            this.transfer(TransferChannelType.Asset, TransferSourceType.SimInventoryItem, priority, transferParams, outAssetID).then((result) =>
            {
                resolve(result);
            }).catch((err) =>
            {
                reject(err);
            });

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
                const result = await this.currentRegion.caps.capsPostXML('RenderMaterials', {
                    'Zipped': new LLSD.LLSD.asBinary(res.toString('base64'))
                });

                const resultZipped = Buffer.from(result['Zipped'].octets);
                zlib.inflate(resultZipped, async (err: Error | null, reslt: Buffer) =>
                {
                    if (err)
                    {
                        reject(error);
                        return;
                    }
                    const binData = new LLSD.Binary(Array.from(reslt), 'BASE64');
                    const llsdResult = LLSD.LLSD.parseBinary(binData);
                    let obj = [];
                    if (llsdResult.result)
                    {
                        obj = llsdResult.result;
                    }
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

    async uploadMesh(name: string, description: string, mesh: Buffer, confirmCostCallback: (cost: number) => boolean): Promise<UUID>
    {
        const decodedMesh = await LLMesh.from(mesh);
        if (!decodedMesh.creatorID.equals(this.agent.agentID) && !decodedMesh.creatorID.equals(UUID.zero()))
        {
            throw new Error('Unable to upload - copyright violation');
        }
        const faces = [];
        const faceCount = decodedMesh.lodLevels['high_lod'].length;
        for (let x = 0; x < faceCount; x++)
        {
            faces.push({
                'diffuse_color': [1.000000000000001, 1.000000000000001, 1.000000000000001, 1.000000000000001],
                'fullbright': false
            });
        }
        const prim = {
            'face_list': faces,
            'position': [0.000000000000001, 0.000000000000001, 0.000000000000001],
            'rotation': [0.000000000000001, 0.000000000000001, 0.000000000000001, 1.000000000000001],
            'scale': [2.000000000000001, 2.000000000000001, 2.000000000000001],
            'material': 3,
            'physics_shape_type': 2,
            'mesh': 0
        };
        const assetResources = {
            'instance_list': [prim],
            'mesh_list': [new LLSD.Binary(Array.from(mesh))],
            'texture_list': [],
            'metric': 'MUT_Unspecified'
        };
        const uploadMap = {
            'name': name,
            'description': description,
            'asset_resources': assetResources,
            'asset_type': 'mesh',
            'inventory_type': 'object',
            'folder_id': new LLSD.UUID(await this.agent.inventory.findFolderForType(FolderType.Object)),
            'texture_folder_id': new LLSD.UUID(await this.agent.inventory.findFolderForType(FolderType.Texture)),
            'everyone_mask': PermissionMask.All,
            'group_mask': PermissionMask.All,
            'next_owner_mask': PermissionMask.All
        };
        const result = await this.currentRegion.caps.capsPostXML('NewFileAgentInventory', uploadMap);
        if (result['state'] === 'upload' && result['upload_price'] !== undefined)
        {
            const cost = result['upload_price'];
            if (await confirmCostCallback(cost))
            {
                const uploader = result['uploader'];
                const uploadResult = await this.currentRegion.caps.capsPerformXMLPost(uploader, assetResources);
                if (uploadResult['new_inventory_item'] && uploadResult['new_asset'])
                {
                    const inventoryItem = new UUID(uploadResult['new_inventory_item'].toString());
                    const item = await this.agent.inventory.fetchInventoryItem(inventoryItem);
                    if (item !== null)
                    {
                        item.assetID = new UUID(uploadResult['new_asset'].toString());
                    }
                    return inventoryItem;
                }
                else
                {

                    throw new Error('Upload failed - no new inventory item returned');
                }
            }
            throw new Error('Upload cost declined')
        }
        else
        {
            console.log(result);
            console.log(JSON.stringify(result.error));
            throw new Error('Upload failed');
        }
    }

    uploadAsset(type: HTTPAssets, data: Buffer, name: string, description: string): Promise<UUID>
    {
        return new Promise<UUID>((resolve, reject) =>
        {
            if (this.agent && this.agent.inventory && this.agent.inventory.main && this.agent.inventory.main.root)
            {
                this.currentRegion.caps.capsPostXML('NewFileAgentInventory', {
                    'folder_id': new LLSD.UUID(this.agent.inventory.main.root.toString()),
                    'asset_type': type,
                    'inventory_type': Utils.HTTPAssetTypeToInventoryType(type),
                    'name': name,
                    'description': description,
                    'everyone_mask': PermissionMask.All,
                    'group_mask': PermissionMask.All,
                    'next_owner_mask': PermissionMask.All,
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
                    else if (response['error'])
                    {
                        reject(response['error']['message']);
                    }
                    else
                    {
                        reject('Unable to upload asset');
                    }
                }).catch((err) =>
                {
                    console.log('Got err');
                    console.log(err);
                    reject(err);
                })
            }
            else
            {
                if (!this.agent)
                {
                    throw(new Error('Missing agent'));
                }
                else if (!this.agent.inventory)
                {
                    throw(new Error('Missing agent inventory'));
                }
                else if (!this.agent.inventory.main)
                {
                    throw new Error('Missing agent inventory main skeleton');
                }
                else if (!this.agent.inventory.main.root)
                {
                    throw new Error('Missing agent inventory main skeleton root');
                }
            }
        });
    }
}
