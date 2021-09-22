import { UUID } from './UUID';
import { InventoryType } from '../enums/InventoryType';
import { PermissionMask } from '../enums/PermissionMask';
import { InventoryItemFlags } from '../enums/InventoryItemFlags';
import { AssetType } from '../enums/AssetType';
import * as builder from 'xmlbuilder';
import { Utils } from './Utils';
import { AttachmentPoint } from '../enums/AttachmentPoint';
import { RezSingleAttachmentFromInvMessage } from './messages/RezSingleAttachmentFromInv';
import { GameObject } from '..';
import { Agent } from './Agent';
import { Subscription } from 'rxjs';
import { DetachAttachmentIntoInvMessage } from './messages/DetachAttachmentIntoInv';
import { Vector3 } from './Vector3';
import { RezObjectMessage } from './messages/RezObject';
import { NewObjectEvent } from '../events/NewObjectEvent';
import { InventoryFolder } from './InventoryFolder';
import { MoveInventoryItemMessage } from './messages/MoveInventoryItem';
import { RemoveInventoryItemMessage } from './messages/RemoveInventoryItem';
import { SaleTypeLL } from '../enums/SaleTypeLL';
import { AssetTypeLL } from '../enums/AssetTypeLL';
import { UpdateTaskInventoryMessage } from './messages/UpdateTaskInventory';
import { PacketFlags } from '../enums/PacketFlags';
import Timeout = NodeJS.Timeout;
import * as LLSD from '@caspertech/llsd';
import { MoveTaskInventoryMessage } from './messages/MoveTaskInventory';
import { UpdateCreateInventoryItemMessage } from './messages/UpdateCreateInventoryItem';
import { Message } from '../enums/Message';
import { FilterResponse } from '../enums/FilterResponse';
import { UpdateInventoryItemMessage } from './messages/UpdateInventoryItem';

export class InventoryItem
{
    assetID: UUID = UUID.zero();
    inventoryType: InventoryType;
    name: string;
    salePrice: number;
    saleType: number;
    created: Date;
    parentID: UUID;
    flags: InventoryItemFlags;
    itemID: UUID;
    oldItemID?: UUID;
    parentPartID?: UUID;
    permsGranter?: UUID;
    description: string;
    type: AssetType;
    callbackID: number;
    permissions: {
        baseMask: PermissionMask;
        groupMask: PermissionMask;
        nextOwnerMask: PermissionMask;
        ownerMask: PermissionMask;
        everyoneMask: PermissionMask;
        lastOwner: UUID;
        owner: UUID;
        creator: UUID;
        group: UUID;
        groupOwned?: boolean
    } = {
        baseMask: 0,
        groupMask: 0,
        nextOwnerMask: 0,
        ownerMask: 0,
        everyoneMask: 0,
        lastOwner: UUID.zero(),
        owner: UUID.zero(),
        creator: UUID.zero(),
        group: UUID.zero(),
        groupOwned: false
    };

    static fromAsset(lineObj: {lines: string[], lineNum: number}, container?: GameObject | InventoryFolder, agent?: Agent): InventoryItem
    {
        const item: InventoryItem = new InventoryItem(container, agent);
        while (lineObj.lineNum < lineObj.lines.length)
        {
            const line = lineObj.lines[lineObj.lineNum++];
            let result = Utils.parseLine(line);
            if (result.key !== null)
            {
                if (result.key === '{')
                {
                    // do nothing
                }
                else if (result.key === '}')
                {
                    break;
                }
                else if (result.key === 'item_id')
                {
                    item.itemID = new UUID(result.value);
                }
                else if (result.key === 'parent_id')
                {
                    item.parentID = new UUID(result.value);
                }
                else if (result.key === 'permissions')
                {
                    while (lineObj.lineNum < lineObj.lines.length)
                    {
                        result = Utils.parseLine(lineObj.lines[lineObj.lineNum++]);
                        if (result.key !== null)
                        {
                            if (result.key === '{')
                            {
                                // do nothing
                            }
                            else if (result.key === '}')
                            {
                                break;
                            }
                            else if (result.key === 'creator_mask')
                            {
                                item.permissions.baseMask = parseInt(result.value, 16);
                            }
                            else if (result.key === 'base_mask')
                            {
                                item.permissions.baseMask = parseInt(result.value, 16);
                            }
                            else if (result.key === 'owner_mask')
                            {
                                item.permissions.ownerMask = parseInt(result.value, 16);
                            }
                            else if (result.key === 'group_mask')
                            {
                                item.permissions.groupMask = parseInt(result.value, 16);
                            }
                            else if (result.key === 'everyone_mask')
                            {
                                item.permissions.everyoneMask = parseInt(result.value, 16);
                            }
                            else if (result.key === 'next_owner_mask')
                            {
                                item.permissions.nextOwnerMask = parseInt(result.value, 16);
                            }
                            else if (result.key === 'creator_id')
                            {
                                item.permissions.creator = new UUID(result.value);
                            }
                            else if (result.key === 'owner_id')
                            {
                                item.permissions.owner = new UUID(result.value);
                            }
                            else if (result.key === 'last_owner_id')
                            {
                                item.permissions.lastOwner = new UUID(result.value);
                            }
                            else if (result.key === 'group_id')
                            {
                                item.permissions.group = new UUID(result.value);
                            }
                            else if (result.key === 'group_owned')
                            {
                                const val = parseInt(result.value, 10);
                                item.permissions.groupOwned = (val !== 0);
                            }
                            else
                            {
                                console.log('Unrecognised key (4): ' + result.key);
                            }
                        }
                    }
                }
                else if (result.key === 'sale_info')
                {
                    while (lineObj.lineNum < lineObj.lines.length)
                    {
                        result = Utils.parseLine(lineObj.lines[lineObj.lineNum++]);
                        if (result.key !== null)
                        {
                            if (result.key === '{')
                            {
                                // do nothing
                            }
                            else if (result.key === '}')
                            {
                                break;
                            }
                            else if (result.key === 'sale_type')
                            {
                                const typeString = result.value as any;
                                item.saleType = parseInt(SaleTypeLL[typeString], 10);
                            }
                            else if (result.key === 'sale_price')
                            {
                                item.salePrice = parseInt(result.value, 10);
                            }
                            else
                            {
                                console.log('Unrecognised key (3): ' + result.key);
                            }
                        }
                    }
                }
                else if (result.key === 'shadow_id')
                {
                    item.assetID = new UUID(result.value).bitwiseXor(new UUID('3c115e51-04f4-523c-9fa6-98aff1034730'));
                }
                else if (result.key === 'asset_id')
                {
                    item.assetID = new UUID(result.value);
                }
                else if (result.key === 'type')
                {
                    const typeString = result.value as any;
                    item.type = parseInt(AssetTypeLL[typeString], 10);
                }
                else if (result.key === 'inv_type')
                {
                    const typeString = String(result.value);
                    switch (typeString)
                    {
                        case 'texture':
                            item.inventoryType = InventoryType.Texture;
                            break;
                        case 'sound':
                            item.inventoryType = InventoryType.Sound;
                            break;
                        case 'callcard':
                            item.inventoryType = InventoryType.CallingCard;
                            break;
                        case 'landmark':
                            item.inventoryType = InventoryType.Landmark;
                            break;
                        case 'object':
                            item.inventoryType = InventoryType.Object;
                            break;
                        case 'notecard':
                            item.inventoryType = InventoryType.Notecard;
                            break;
                        case 'category':
                            item.inventoryType = InventoryType.Category;
                            break;
                        case 'root':
                            item.inventoryType = InventoryType.RootCategory;
                            break;
                        case 'script':
                            item.inventoryType = InventoryType.Script;
                            break;
                        case 'snapshot':
                            item.inventoryType = InventoryType.Snapshot;
                            break;
                        case 'LSL':
                            item.inventoryType = InventoryType.LSL;
                            break;
                        case 'attach':
                            item.inventoryType = InventoryType.Attachment;
                            break;
                        case 'wearable':
                            item.inventoryType = InventoryType.Wearable;
                            break;
                        case 'animation':
                            item.inventoryType = InventoryType.Animation;
                            break;
                        case 'gesture':
                            item.inventoryType = InventoryType.Gesture;
                            break;
                        case 'mesh':
                            item.inventoryType = InventoryType.Mesh;
                            break;
                        default:
                            console.error('Unknown inventory type: ' + typeString);
                    }
                }
                else if (result.key === 'flags')
                {
                    item.flags = parseInt(result.value, 16);
                }
                else if (result.key === 'name')
                {
                    item.name = result.value.substr(0, result.value.indexOf('|'));
                }
                else if (result.key === 'desc')
                {
                    item.description = result.value.substr(0, result.value.indexOf('|'));
                }
                else if (result.key === 'creation_date')
                {
                    item.created = new Date(parseInt(result.value, 10) * 1000);
                }
                else
                {
                    console.log('Unrecognised key (2): ' + result.key);
                }
            }
        }
        return item;
    }

    static async fromXML(xml: string): Promise<InventoryItem>
    {
        const parsed = await Utils.parseXML(xml);

        if (!parsed['InventoryItem'])
        {
            throw new Error('InventoryItem not found');
        }
        const inventoryItem = new InventoryItem();
        const result = parsed['InventoryItem'];
        let prop: any;
        if ((prop = Utils.getFromXMLJS(result, 'Name')) !== undefined)
        {
            inventoryItem.name = prop.toString();
        }
        if ((prop = Utils.getFromXMLJS(result, 'ID')) !== undefined)
        {
            try
            {
                inventoryItem.itemID = new UUID(prop.toString());
            }
            catch (error)
            {
                console.error(error);
            }
        }
        if ((prop = Utils.getFromXMLJS(result, 'InvType')) !== undefined)
        {
            inventoryItem.inventoryType = parseInt(prop, 10);
        }
        if ((prop = Utils.getFromXMLJS(result, 'CreatorUUID')) !== undefined)
        {
            try
            {
                inventoryItem.permissions.creator = new UUID(prop.toString());
            }
            catch (err)
            {
                console.error(err);
            }
        }
        if ((prop = Utils.getFromXMLJS(result, 'CreationDate')) !== undefined)
        {
            try
            {
                inventoryItem.created = new Date(parseInt(prop, 10) * 1000);
            }
            catch (err)
            {
                console.error(err);
            }
        }
        if ((prop = Utils.getFromXMLJS(result, 'Owner')) !== undefined)
        {
            try
            {
                inventoryItem.permissions.owner = new UUID(prop.toString());
            }
            catch (err)
            {
                console.error(err);
            }
        }
        if ((prop = Utils.getFromXMLJS(result, 'Description')) !== undefined)
        {
            inventoryItem.description = prop.toString();
        }
        if ((prop = Utils.getFromXMLJS(result, 'AssetType')) !== undefined)
        {
            inventoryItem.type = parseInt(prop, 10);
        }
        if ((prop = Utils.getFromXMLJS(result, 'AssetID')) !== undefined)
        {
            try
            {
                inventoryItem.assetID = new UUID(prop.toString());
            }
            catch (err)
            {
                console.error(err);
            }
        }
        if ((prop = Utils.getFromXMLJS(result, 'SaleType')) !== undefined)
        {
            inventoryItem.saleType = parseInt(prop, 10);
        }
        if ((prop = Utils.getFromXMLJS(result, 'SalePrice')) !== undefined)
        {
            inventoryItem.salePrice = parseInt(prop, 10);
        }
        if ((prop = Utils.getFromXMLJS(result, 'BasePermissions')) !== undefined)
        {
            inventoryItem.permissions.baseMask = parseInt(prop, 10);
        }
        if ((prop = Utils.getFromXMLJS(result, 'CurrentPermissions')) !== undefined)
        {
            inventoryItem.permissions.ownerMask = parseInt(prop, 10);
        }
        if ((prop = Utils.getFromXMLJS(result, 'EveryonePermissions')) !== undefined)
        {
            inventoryItem.permissions.everyoneMask = parseInt(prop, 10);
        }
        if ((prop = Utils.getFromXMLJS(result, 'NextPermissions')) !== undefined)
        {
            inventoryItem.permissions.nextOwnerMask = parseInt(prop, 10);
        }
        if ((prop = Utils.getFromXMLJS(result, 'Flags')) !== undefined)
        {
            inventoryItem.flags = parseInt(prop, 10);
        }
        if ((prop = Utils.getFromXMLJS(result, 'GroupID')) !== undefined)
        {
            try
            {
                inventoryItem.permissions.group = new UUID(prop.toString());
            }
            catch (err)
            {
                console.error(err);
            }
        }
        if ((prop = Utils.getFromXMLJS(result, 'LastOwner')) !== undefined)
        {
            try
            {
                inventoryItem.permissions.lastOwner = new UUID(prop.toString());
            }
            catch (err)
            {
                console.error(err);
            }
        }
        if ((prop = Utils.getFromXMLJS(result, 'GroupOwned')) !== undefined)
        {
            inventoryItem.permissions.groupOwned = parseInt(prop, 10) > 0
        }
        return inventoryItem;
    }

    constructor(private container?: GameObject | InventoryFolder, private agent?: Agent)
    {

    }

    toAsset(indent: string = '')
    {
        const lines: string[] = [];
        lines.push('{');
        lines.push('\titem_id\t' + this.itemID.toString());
        lines.push('\tparent_id\t' + this.parentID.toString());
        lines.push('permissions 0');
        lines.push('{');
        lines.push('\tbase_mask\t' + Utils.numberToFixedHex(this.permissions.baseMask));
        lines.push('\towner_mask\t' + Utils.numberToFixedHex(this.permissions.ownerMask));
        lines.push('\tgroup_mask\t' + Utils.numberToFixedHex(this.permissions.groupMask));
        lines.push('\teveryone_mask\t' + Utils.numberToFixedHex(this.permissions.everyoneMask));
        lines.push('\tnext_owner_mask\t' + Utils.numberToFixedHex(this.permissions.nextOwnerMask));
        lines.push('\tcreator_id\t' + this.permissions.creator.toString());
        lines.push('\towner_id\t' + this.permissions.owner.toString());
        lines.push('\tlast_owner_id\t' + this.permissions.lastOwner.toString());
        lines.push('\tgroup_id\t' + this.permissions.group.toString());
        lines.push('}');
        lines.push('\tasset_id\t' + this.assetID.toString());
        lines.push('\ttype\t' + Utils.AssetTypeToHTTPAssetType(this.type));
        lines.push('\tinv_type\t' + Utils.InventoryTypeToLLInventoryType(this.inventoryType));
        lines.push('\tflags\t' + Utils.numberToFixedHex(this.flags));
        lines.push('sale_info\t0');
        lines.push('{');
        switch (this.saleType)
        {
            case 0:
                lines.push('\tsale_type\tnot');
                break;
            case 1:
                lines.push('\tsale_type\torig');
                break;
            case 2:
                lines.push('\tsale_type\tcopy');
                break;
            case 3:
                lines.push('\tsale_type\tcntn');
                break;
        }
        lines.push('\tsale_price\t' + this.salePrice);
        lines.push('}');
        lines.push('\tname\t' + this.name + '|');
        lines.push('\tdesc\t' + this.description + '|');
        lines.push('\tcreation_date\t' + Math.floor(this.created.getTime() / 1000));
        lines.push('}');

        return indent + lines.join('\n' + indent);
    }

    getCRC(): number
    {
        let crc = 0;
        crc = crc + this.itemID.CRC() >>> 0;
        crc = crc + this.parentID.CRC() >>> 0;
        crc = crc + this.permissions.creator.CRC() >>> 0;
        crc = crc + this.permissions.owner.CRC() >>> 0;
        crc = crc + this.permissions.group.CRC() >>> 0;
        crc = crc + this.permissions.baseMask >>> 0;
        crc = crc + this.permissions.ownerMask >>> 0;
        crc = crc + this.permissions.everyoneMask >>> 0;
        crc = crc + this.permissions.groupMask >>> 0;

        crc = crc + this.assetID.CRC() >>> 0;
        crc = crc + this.type >>> 0;
        crc = crc + this.inventoryType >>> 0;

        crc = crc + this.flags >>> 0;
        crc = crc + this.salePrice >>> 0;
        crc = crc + (this.saleType * 0x07073096 >>> 0) >>> 0;
        crc = crc + Math.round(this.created.getTime() / 1000) >>> 0;
        return crc;
    }

    async update(): Promise<void>
    {
        if (this.agent === undefined)
        {
            throw new Error('This inventoryItem is local only and cannot be updated')
        }
        const msg = new UpdateInventoryItemMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.agent.currentRegion.circuit.sessionID,
            TransactionID: UUID.random()
        };
        msg.InventoryData = [{
            ItemID: this.itemID,
            FolderID: this.parentID,
            CreatorID: this.permissions.creator,
            OwnerID: this.permissions.owner,
            GroupID: this.permissions.group,
            BaseMask: this.permissions.baseMask,
            OwnerMask: this.permissions.ownerMask,
            GroupMask: this.permissions.groupMask,
            EveryoneMask: this.permissions.everyoneMask,
            NextOwnerMask: this.permissions.nextOwnerMask,
            GroupOwned: this.permissions.groupOwned || false,
            TransactionID: UUID.zero(),
            CallbackID: 0,
            Type: this.type,
            InvType: this.inventoryType,
            Flags: this.flags,
            SaleType: this.saleType,
            SalePrice: this.salePrice,
            Name: Utils.StringToBuffer(this.name),
            Description: Utils.StringToBuffer(this.description),
            CreationDate: this.created.getTime() / 1000,
            CRC: this.getCRC()
        }];
        const ack = this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
        return this.agent.currentRegion.circuit.waitForAck(ack, 10000);
    }

    async moveToFolder(targetFolder: InventoryFolder): Promise<InventoryItem>
    {
        if (this.agent !== undefined)
        {
            if (this.container instanceof GameObject)
            {
                const msg = new MoveTaskInventoryMessage();
                msg.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: this.agent.currentRegion.circuit.sessionID,
                    FolderID: targetFolder.folderID
                };
                msg.InventoryData = {
                    LocalID: this.container.ID,
                    ItemID: this.itemID
                };
                this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
                const response: UpdateCreateInventoryItemMessage = await this.agent.currentRegion.circuit.waitForMessage<UpdateCreateInventoryItemMessage>(Message.UpdateCreateInventoryItem, 10000, (message: UpdateCreateInventoryItemMessage) =>
                {
                    for (const inv of message.InventoryData)
                    {
                        if (Utils.BufferToStringSimple(inv.Name) === this.name)
                        {
                            return FilterResponse.Finish;
                        }
                    }
                    return FilterResponse.NoMatch;
                });
                for (const inv of response.InventoryData)
                {
                    if (Utils.BufferToStringSimple(inv.Name) === this.name)
                    {
                        const item = await this.agent.inventory.fetchInventoryItem(inv.ItemID);
                        if (item === null)
                        {
                            throw new Error('Unable to get inventory item after move');
                        }
                        if (!item.parentID.equals(targetFolder.folderID))
                        {
                            await item.moveToFolder(targetFolder);
                        }
                        return item;
                    }
                }
                throw new Error('Unable to get inventory item after move');
            }
            else
            {
                const msg = new MoveInventoryItemMessage();
                msg.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: this.agent.currentRegion.circuit.sessionID,
                    Stamp: false
                };
                msg.InventoryData = [
                    {
                        ItemID: this.itemID,
                        FolderID: targetFolder.folderID,
                        NewName: Buffer.alloc(0)
                    }
                ];
                const ack = this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
                await this.agent.currentRegion.circuit.waitForAck(ack, 10000);
                const item = await this.agent.inventory.fetchInventoryItem(this.itemID);
                if (item === null)
                {
                    throw new Error('Unable to find inventory item after move')
                }
                return item;
            }
        }
        else
        {
            throw new Error('This inventoryItem is local only and cannot be moved to a folder')
        }
    }

    async delete()
    {
        if (this.agent !== undefined)
        {
            const msg = new RemoveInventoryItemMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.agent.currentRegion.circuit.sessionID
            };
            msg.InventoryData = [
                {
                    ItemID: this.itemID
                }
            ];
            const ack = this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
            return this.agent.currentRegion.circuit.waitForAck(ack, 10000);
        }
        else
        {
            throw new Error('This inventoryItem is local only and cannot be deleted')
        }
    }

    async exportXML(): Promise<string>
    {
        const document = builder.create('InventoryItem');
        document.ele('Name', this.name);
        document.ele('ID', this.itemID.toString());
        document.ele('InvType', this.inventoryType);
        document.ele('CreatorUUID', this.permissions.creator.toString());
        document.ele('CreationDate', this.created.getTime() / 1000);
        document.ele('Owner', this.permissions.owner.toString());
        document.ele('LastOwner', this.permissions.lastOwner.toString());
        document.ele('Description', this.description);
        document.ele('AssetType', this.type);
        document.ele('AssetID', this.assetID.toString());
        document.ele('SaleType', this.saleType);
        document.ele('SalePrice', this.salePrice);
        document.ele('BasePermissions', this.permissions.baseMask);
        document.ele('CurrentPermissions', this.permissions.ownerMask);
        document.ele('EveryonePermissions', this.permissions.everyoneMask);
        document.ele('NextPermissions', this.permissions.nextOwnerMask);
        document.ele('Flags', this.flags);
        document.ele('GroupID', this.permissions.group.toString());
        document.ele('GroupOwned', this.permissions.groupOwned);
        return document.end({pretty: true, allowEmpty: true});
    }

    detachFromAvatar()
    {
        if (this.agent === undefined)
        {
            throw new Error('This inventory item was created locally. Please import to the grid.');
        }
        const msg = new DetachAttachmentIntoInvMessage();
        msg.ObjectData = {
            AgentID: this.agent.agentID,
            ItemID: this.itemID
        };
        const ack = this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
        return this.agent.currentRegion.circuit.waitForAck(ack, 10000);
    }

    attachToAvatar(attachPoint: AttachmentPoint, timeout: number = 10000): Promise<GameObject>
    {
        return new Promise<GameObject>((resolve, reject) =>
        {
            if (this.agent === undefined)
            {
                throw new Error('This inventory item was created locally. Please import to the grid.');
            }
            const rsafi = new RezSingleAttachmentFromInvMessage();
            rsafi.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.agent.currentRegion.circuit.sessionID
            };

            rsafi.ObjectData = {
                ItemID: this.itemID,
                OwnerID: this.permissions.owner,
                AttachmentPt: 0x80 | attachPoint,
                ItemFlags: this.flags,
                GroupMask: this.permissions.groupMask,
                EveryoneMask: this.permissions.everyoneMask,
                NextOwnerMask: this.permissions.nextOwnerMask,
                Name: Utils.StringToBuffer(this.name),
                Description: Utils.StringToBuffer(this.description)
            };
            const avatar = this.agent.currentRegion.clientCommands.agent.getAvatar();
            if (avatar === undefined)
            {
                throw new Error('Avatar could not be found');
            }
            let subs: Subscription | undefined = undefined;
            let tmout: Timeout | undefined = undefined;
            subs = avatar.onAttachmentAdded.subscribe((obj: GameObject) =>
            {
                if (obj.name === this.name)
                {
                    if (subs !== undefined)
                    {
                        subs.unsubscribe();
                        subs = undefined;
                    }
                    if (tmout !== undefined)
                    {
                        clearTimeout(tmout);
                        tmout = undefined;
                    }
                    resolve(obj);
                }
            });
            setTimeout(() =>
            {
                if (subs !== undefined)
                {
                    subs.unsubscribe();
                    subs = undefined;
                }
                if (tmout !== undefined)
                {
                    clearTimeout(tmout);
                    tmout = undefined;
                }
                reject(new Error('Attach to avatar timed out'));
            }, timeout);
            this.agent.currentRegion.circuit.sendMessage(rsafi, PacketFlags.Reliable);
        });
    }

    rezGroupInWorld(position: Vector3): Promise<GameObject[]>
    {
        return new Promise<GameObject[]>(async (resolve, reject) =>
        {
            if (this.agent === undefined)
            {
                reject(new Error('This InventoryItem is local only, so cant rez'));
                return;
            }
            const queryID = UUID.random();
            const msg = new RezObjectMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.agent.currentRegion.circuit.sessionID,
                GroupID: UUID.zero()
            };
            msg.RezData = {
                FromTaskID: (this.container instanceof GameObject) ? this.container.FullID : UUID.zero(),
                BypassRaycast: 1,
                RayStart: position,
                RayEnd: position,
                RayTargetID: UUID.zero(),
                RayEndIsIntersection: false,
                RezSelected: true,
                RemoveItem: false,
                ItemFlags: this.flags,
                GroupMask: PermissionMask.All,
                EveryoneMask: PermissionMask.All,
                NextOwnerMask: PermissionMask.All,
            };
            msg.InventoryData = {
                ItemID: this.itemID,
                FolderID: this.parentID,
                CreatorID: this.permissions.creator,
                OwnerID: this.permissions.owner,
                GroupID: this.permissions.group,
                BaseMask: this.permissions.baseMask,
                OwnerMask: this.permissions.ownerMask,
                GroupMask: this.permissions.groupMask,
                EveryoneMask: this.permissions.everyoneMask,
                NextOwnerMask: this.permissions.nextOwnerMask,
                GroupOwned: false,
                TransactionID: queryID,
                Type: this.type,
                InvType: this.inventoryType,
                Flags: this.flags,
                SaleType: this.saleType,
                SalePrice: this.salePrice,
                Name: Utils.StringToBuffer(this.name),
                Description: Utils.StringToBuffer(this.description),
                CreationDate: Math.round(this.created.getTime() / 1000),
                CRC: 0,
            };

            let objSub: Subscription | undefined = undefined;

            const agent = this.agent;

            const gotObjects: GameObject[] = [];

            objSub = this.agent.currentRegion.clientEvents.onNewObjectEvent.subscribe(async (evt: NewObjectEvent) =>
            {
                if (evt.createSelected && !evt.object.resolvedAt)
                {
                    // We need to get the full ObjectProperties so we can be sure this is or isn't a rez from inventory
                    await agent.currentRegion.clientCommands.region.resolveObject(evt.object, false, true);
                }
                if (evt.createSelected && !evt.object.claimedForBuild)
                {
                    if (evt.object.itemID !== undefined && evt.object.itemID.equals(this.itemID))
                    {
                        evt.object.claimedForBuild = true;
                        gotObjects.push(evt.object);
                    }
                }
            });

            // We have no way of knowing when the cluster is finished rezzing, so we just wait for 30 seconds
            setTimeout(() =>
            {
                if (objSub !== undefined)
                {
                    objSub.unsubscribe();
                    objSub = undefined;
                }
                if (gotObjects.length > 0)
                {
                    resolve(gotObjects);
                }
                else
                {
                    reject(new Error('No objects arrived'));
                }
            }, 30000);

            // Move the camera to look directly at prim for faster capture
            const camLocation = new Vector3(position);
            camLocation.z += (5) + 1;
            await this.agent.currentRegion.clientCommands.agent.setCamera(camLocation, position, 256, new Vector3([-1.0, 0, 0]), new Vector3([0.0, 1.0, 0]));
            this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
        });
    }

    rezInWorld(position: Vector3, objectScale?: Vector3): Promise<GameObject>
    {
        return new Promise<GameObject>(async (resolve, reject) =>
        {
            if (this.agent === undefined)
            {
                reject(new Error('This InventoryItem is local only, so cant rez'));
                return;
            }
            const queryID = UUID.random();
            const msg = new RezObjectMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.agent.currentRegion.circuit.sessionID,
                GroupID: UUID.zero()
            };
            msg.RezData = {
                FromTaskID: (this.container instanceof GameObject) ? this.container.FullID : UUID.zero(),
                BypassRaycast: 1,
                RayStart: position,
                RayEnd: position,
                RayTargetID: UUID.zero(),
                RayEndIsIntersection: false,
                RezSelected: true,
                RemoveItem: false,
                ItemFlags: this.flags,
                GroupMask: PermissionMask.All,
                EveryoneMask: PermissionMask.All,
                NextOwnerMask: PermissionMask.All,
            };
            msg.InventoryData = {
                ItemID: this.itemID,
                FolderID: this.parentID,
                CreatorID: this.permissions.creator,
                OwnerID: this.permissions.owner,
                GroupID: this.permissions.group,
                BaseMask: this.permissions.baseMask,
                OwnerMask: this.permissions.ownerMask,
                GroupMask: this.permissions.groupMask,
                EveryoneMask: this.permissions.everyoneMask,
                NextOwnerMask: this.permissions.nextOwnerMask,
                GroupOwned: false,
                TransactionID: queryID,
                Type: this.type,
                InvType: this.inventoryType,
                Flags: this.flags,
                SaleType: this.saleType,
                SalePrice: this.salePrice,
                Name: Utils.StringToBuffer(this.name),
                Description: Utils.StringToBuffer(this.description),
                CreationDate: Math.round(this.created.getTime() / 1000),
                CRC: 0,
            };

            let objSub: Subscription | undefined = undefined;
            let timeout: Timeout | undefined = setTimeout(() =>
            {
                if (objSub !== undefined)
                {
                    objSub.unsubscribe();
                    objSub = undefined;
                }
                if (timeout !== undefined)
                {
                    clearTimeout(timeout);
                    timeout = undefined;
                }
                reject(new Error('Prim never arrived'));
            }, 10000);
            let claimedPrim = false;
            const agent = this.agent;
            objSub = this.agent.currentRegion.clientEvents.onNewObjectEvent.subscribe(async (evt: NewObjectEvent) =>
            {
                if (evt.createSelected && !evt.object.resolvedAt)
                {
                    // We need to get the full ObjectProperties so we can be sure this is or isn't a rez from inventory
                    await agent.currentRegion.clientCommands.region.resolveObject(evt.object, false, true);
                }
                if (evt.createSelected && !evt.object.claimedForBuild && !claimedPrim)
                {
                    if (evt.object.itemID !== undefined && evt.object.itemID.equals(this.itemID))
                    {
                        if (objSub !== undefined)
                        {
                            objSub.unsubscribe();
                            objSub = undefined;
                        }
                        if (timeout !== undefined)
                        {
                            clearTimeout(timeout);
                            timeout = undefined;
                        }
                        evt.object.claimedForBuild = true;
                        claimedPrim = true;
                        resolve(evt.object);
                    }
                }
            });

            // Move the camera to look directly at prim for faster capture
            let height = 10;
            if (objectScale !== undefined)
            {
                height = objectScale.z;
            }
            const camLocation = new Vector3(position);
            camLocation.z += (height / 2) + 1;
            await this.agent.currentRegion.clientCommands.agent.setCamera(camLocation, position, height, new Vector3([-1.0, 0, 0]), new Vector3([0.0, 1.0, 0]));
            this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
        });
    }

    async renameInTask(task: GameObject, newName: string)
    {
        this.name = newName;
        if (this.agent === undefined)
        {
            return;
        }
        const msg = new UpdateTaskInventoryMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.agent.currentRegion.circuit.sessionID
        };
        msg.UpdateData = {
            Key: 0,
            LocalID: task.ID
        };
        msg.InventoryData = {
            ItemID: this.itemID,
            FolderID: this.parentID,
            CreatorID: this.permissions.creator,
            OwnerID: this.permissions.owner,
            GroupID: this.permissions.group,
            BaseMask: this.permissions.baseMask,
            OwnerMask: this.permissions.ownerMask,
            GroupMask: this.permissions.groupMask,
            EveryoneMask: this.permissions.everyoneMask,
            NextOwnerMask: this.permissions.nextOwnerMask,
            GroupOwned: this.permissions.groupOwned || false,
            TransactionID: UUID.zero(),
            Type: this.type,
            InvType: this.inventoryType,
            Flags: this.flags,
            SaleType: this.saleType,
            SalePrice: this.salePrice,
            Name: Utils.StringToBuffer(this.name),
            Description: Utils.StringToBuffer(this.description),
            CreationDate: this.created.getTime() / 1000,
            CRC: this.getCRC()
        };
        return this.agent.currentRegion.circuit.waitForAck(this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable), 10000);
    }

    async updateScript(scriptAsset: Buffer): Promise<UUID>
    {
        if (this.agent === undefined)
        {
            throw new Error('This item was created locally and can\'t be updated');
        }
        if (this.container instanceof GameObject)
        {
            try
            {
                const result: any = await this.agent.currentRegion.caps.capsPostXML('UpdateScriptTask', {
                    'item_id': new LLSD.UUID(this.itemID.toString()),
                    'task_id': new LLSD.UUID(this.container.FullID.toString()),
                    'is_script_running': true,
                    'target': 'mono'
                });
                if (result['uploader'])
                {
                    const uploader = result['uploader'];
                    const uploadResult: any = await this.agent.currentRegion.caps.capsRequestUpload(uploader, scriptAsset);
                    if (uploadResult['state'] && uploadResult['state'] === 'complete')
                    {
                        return new UUID(uploadResult['new_asset'].toString());
                    }
                }
                throw new Error('Asset upload failed');
            }
            catch (err)
            {
                console.error(err);
                throw err;
            }
        }
        else
        {
            throw new Error('Agent inventory not supported just yet')
        }
    }
}
