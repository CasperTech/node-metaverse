import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import * as LLSD from '@caspertech/llsd';
import { Utils } from '../Utils';
import * as zlib from 'zlib';
import { ZlibOptions } from 'zlib';
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
import { HTTPAssets } from '../../enums/HTTPAssets';
import { InventoryFolder } from '../InventoryFolder';
import { InventoryItem } from '../InventoryItem';
import { BulkUpdateInventoryEvent } from '../../events/BulkUpdateInventoryEvent';
import { FilterResponse } from '../../enums/FilterResponse';
import { LLLindenText } from '../LLLindenText';
import { Logger } from '../Logger';
import { Subscription } from 'rxjs';

export class AssetCommands extends CommandsBase
{
    private callbackID = 0;

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

    async copyInventoryFromNotecard(notecardID: UUID, folder: InventoryFolder, itemID: UUID, objectID: UUID = UUID.zero()): Promise<InventoryItem>
    {
        const gotCap = await this.currentRegion.caps.isCapAvailable('CopyInventoryFromNotecard');
        if (gotCap)
        {
            const callbackID = Math.floor(Math.random() * 2147483647);
            const request = {
                'callback-id': callbackID,
                'folder-id': new LLSD.UUID(folder.folderID.toString()),
                'item-id': new LLSD.UUID(itemID.toString()),
                'notecard-id': new LLSD.UUID(notecardID.toString()),
                'object-id': new LLSD.UUID(objectID.toString())
            };
            this.currentRegion.caps.capsPostXML('CopyInventoryFromNotecard', request).then(() => {}).catch((err) =>
            {
                throw err;
            });
            const evt: BulkUpdateInventoryEvent = await Utils.waitOrTimeOut<BulkUpdateInventoryEvent>(this.currentRegion.clientEvents.onBulkUpdateInventoryEvent, 10000, (event: BulkUpdateInventoryEvent) =>
            {
                for (const item of event.itemData)
                {
                    if (item.callbackID === callbackID)
                    {
                        return FilterResponse.Finish;
                    }
                }
                return FilterResponse.NoMatch;
            });
            for (const item of evt.itemData)
            {
                if (item.callbackID === callbackID)
                {
                    return item;
                }
            }
            throw new Error('No match');
        }
        else
        {
            throw new Error('CopyInventoryFromNotecard cap not available');
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
            let gotInfo = true;
            let expectedSize = 0;
            const packets: { [key: number]: Buffer } = {};
            let subscription: Subscription | undefined = undefined;
            let timeout: number | undefined;

            function cleanup()
            {
                if (subscription !== undefined)
                {
                    subscription.unsubscribe();
                    subscription = undefined;
                }
                if (timeout !== undefined)
                {
                    clearTimeout(timeout);
                    timeout = undefined;
                }
            }

            function placeTimeout()
            {
                timeout = setTimeout(() =>
                {
                    cleanup();
                    reject(new Error('Timeout'));
                }, 10000) as any as number;
            }

            function resetTimeout()
            {
                if (timeout !== undefined)
                {
                    clearTimeout(timeout);
                }
                placeTimeout();
            }

            subscription = this.circuit.subscribeToMessages([
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
                            if (!messg.TransferData.TransferID.equals(transferID))
                            {
                                return;
                            }
                            resetTimeout();
                            packets[messg.TransferData.Packet] = messg.TransferData.Data;
                            switch (messg.TransferData.Status)
                            {
                                case TransferStatus.Abort:
                                    cleanup();
                                    reject(new Error('Transfer Aborted'));
                                    break;
                                case TransferStatus.Error:
                                    cleanup();
                                    reject(new Error('Error'));
                                    break;
                                case TransferStatus.Skip:
                                    console.error('TransferPacket: Skip! not sure what this means');
                                    break;
                                case TransferStatus.InsufficientPermissions:
                                    cleanup();
                                    reject(new Error('Insufficient Permissions'));
                                    break;
                                case TransferStatus.NotFound:
                                    cleanup();
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
                            resetTimeout();
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
                                    cleanup();
                                    reject(new Error('Transfer Aborted'));
                                    break;
                                case TransferStatus.Error:
                                    cleanup();
                                    reject(new Error('Error downloading asset'));
                                    // See if we get anything else
                                    break;
                                case TransferStatus.Skip:
                                    console.error('TransferInfo: Skip! not sure what this means');
                                    break;
                                case TransferStatus.InsufficientPermissions:
                                    cleanup();
                                    reject(new Error('Insufficient Permissions'));
                                    break;
                                case TransferStatus.NotFound:
                                    cleanup();
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
                            resetTimeout();
                            cleanup();
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
                            cleanup();
                            resolve(Buffer.concat(buffers));
                        }
                    }
                }
                catch (error)
                {
                    cleanup();
                    reject(error);
                }
            });
            placeTimeout();
            this.circuit.sendMessage(msg, PacketFlags.Reliable);
        });
    }

    downloadInventoryAsset(itemID: UUID, ownerID: UUID, type: AssetType, priority: boolean,  objectID: UUID = UUID.zero(), assetID: UUID = UUID.zero(), outAssetID?: { assetID: UUID }, sourceType: TransferSourceType = TransferSourceType.SimInventoryItem, channelType: TransferChannelType = TransferChannelType.Asset): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            if (type === AssetType.Notecard && assetID.isZero())
            {
                // Empty notecard
                const note = new LLLindenText();
                resolve(note.toAsset());
            }

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

            this.transfer(channelType, sourceType, priority, transferParams, outAssetID).then((result) =>
            {
                resolve(result);
            }).catch((err) =>
            {
                reject(err);
            });

        });
    }

    private async getMaterialsLimited(uuidArray: any[], uuids: {[key: string]: Material | null})
    {
        const binary = LLSD.LLSD.formatBinary(uuidArray);
        const res: Buffer = await Utils.deflate(Buffer.from(binary.toArray()));
        const result = await this.currentRegion.caps.capsPostXML('RenderMaterials', {
            'Zipped': LLSD.LLSD.asBinary(res.toString('base64'))
        });

        const resultZipped = Buffer.from(result['Zipped'].octets);
        const reslt: Buffer = await Utils.inflate(resultZipped);
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
                            uuids[nuuid] = Material.fromLLSDObject(mat['Material']);
                        }
                    }
                }
            }
        }
        else
        {
            throw new Error('Material data not found');
        }
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
        }
        catch (error)
        {
            console.error(error);
        }
    }
}
