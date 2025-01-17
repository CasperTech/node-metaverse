import * as LLSD from '@caspertech/llsd';
import type { Subscription } from 'rxjs';
import * as builder from 'xmlbuilder';
import * as crypto from 'crypto';
import { AssetType } from '../enums/AssetType';
import type { AttachmentPoint } from '../enums/AttachmentPoint';
import { FilterResponse } from '../enums/FilterResponse';
import type { InventoryItemFlags } from '../enums/InventoryItemFlags';
import { InventoryType } from '../enums/InventoryType';
import { Message } from '../enums/Message';
import { PacketFlags } from '../enums/PacketFlags';
import { PermissionMask } from '../enums/PermissionMask';
import { SaleTypeLL } from '../enums/SaleTypeLL';
import type { NewObjectEvent } from '../events/NewObjectEvent';
import type { Agent } from './Agent';
import { InventoryFolder } from './InventoryFolder';
import { DetachAttachmentIntoInvMessage } from './messages/DetachAttachmentIntoInv';
import { MoveInventoryItemMessage } from './messages/MoveInventoryItem';
import { MoveTaskInventoryMessage } from './messages/MoveTaskInventory';
import { RemoveInventoryItemMessage } from './messages/RemoveInventoryItem';
import { RezObjectMessage } from './messages/RezObject';
import { RezSingleAttachmentFromInvMessage } from './messages/RezSingleAttachmentFromInv';
import type { UpdateCreateInventoryItemMessage } from './messages/UpdateCreateInventoryItem';
import { UpdateInventoryItemMessage } from './messages/UpdateInventoryItem';
import { UpdateTaskInventoryMessage } from './messages/UpdateTaskInventory';
import { Utils } from './Utils';
import { UUID } from './UUID';
import { Vector3 } from './Vector3';
import { CopyInventoryItemMessage } from './messages/CopyInventoryItem';
import type { BulkUpdateInventoryEvent } from '../events/BulkUpdateInventoryEvent';
import { AssetTypeRegistry } from './AssetTypeRegistry';
import { InventoryTypeRegistry } from './InventoryTypeRegistry';
import { GameObject } from './public/GameObject';
import { GetScriptRunningMessage } from './messages/GetScriptRunning';
import { ScriptRunningReplyMessage } from './messages/ScriptRunningReply';
import Timeout = NodeJS.Timeout;
import { SetScriptRunningMessage } from './messages/SetScriptRunning';

export class InventoryItem
{
    public assetID: UUID = UUID.zero();
    public inventoryType: InventoryType;
    public name: string;
    public metadata: string;
    public salePrice: number;
    public saleType: number;
    public created: Date;
    public parentID: UUID;
    public flags: InventoryItemFlags;
    public itemID: UUID;
    public oldItemID?: UUID;
    public parentPartID?: UUID;
    public permsGranter?: UUID;
    public description: string;
    public type: AssetType;
    public callbackID: number;
    public scriptRunning?: boolean;
    public scriptMono?: boolean;
    public permissions: {
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

    public constructor(private readonly container?: GameObject | InventoryFolder, private readonly agent?: Agent)
    {

    }

    public static fromEmbeddedAsset(lineObj: { lines: string[], lineNum: number, pos: number }, container?: GameObject | InventoryFolder, agent?: Agent): InventoryItem
    {
        const item: InventoryItem = new InventoryItem(container, agent);
        let contMetadata = false;
        let contName = false;
        let contDesc = false;
        while (lineObj.lineNum < lineObj.lines.length)
        {
            let line = Utils.getNotecardLine(lineObj);

            if (contMetadata)
            {
                const idx = line.indexOf('|');
                if (idx !== -1)
                {
                    item.metadata += '\n' + line.substring(0, idx);
                    line = line.substring(idx + 1);
                    contMetadata = false;
                    if (line.length === 0)
                    {
                        continue;
                    }
                }
                else
                {
                    item.metadata += line;
                    continue;
                }
            }
            if (contName)
            {
                const idx = line.indexOf('|');
                if (idx !== -1)
                {
                    item.name +=  '\n' + line.substring(0, idx);
                    line = line.substring(idx + 1);
                    contName = false;
                    if (line.length === 0)
                    {
                        continue;
                    }
                }
                else
                {
                    item.name += line;
                    continue;
                }
            }
            if (contDesc)
            {
                const idx = line.indexOf('|');
                if (idx !== -1)
                {
                    item.description +=  '\n' + line.substring(0, idx);
                    line = line.substring(idx + 1);
                    contDesc = false;
                    if (line.length === 0)
                    {
                        continue;
                    }
                }
                else
                {
                    item.description += line;
                    continue;
                }
            }

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
                        result = Utils.parseLine(Utils.getNotecardLine(lineObj));
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
                        result = Utils.parseLine(Utils.getNotecardLine(lineObj));
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
                    const typeString = result.value;
                    const type = AssetTypeRegistry.getTypeFromTypeName(typeString);
                    if (type !== undefined)
                    {
                        item.type = type.type;
                    }
                }
                else if (result.key === 'inv_type')
                {
                    const t = InventoryTypeRegistry.getTypeFromTypeName(String(result.value));
                    item.inventoryType = t?.type ?? InventoryType.Unknown;
                }
                else if (result.key === 'flags')
                {
                    item.flags = parseInt(result.value, 16);
                }
                else if (result.key === 'name')
                {
                    if (result.value.includes('|'))
                    {
                        item.name = result.value.substring(0, result.value.indexOf('|'));
                    }
                    else
                    {
                        contName = true;
                        item.name = result.value;
                    }
                }
                else if (result.key === 'desc')
                {
                    if (result.value.includes('|'))
                    {
                        item.description = result.value.substring(0, result.value.indexOf('|'));
                    }
                    else
                    {
                        contDesc = true;
                        item.description = result.value;
                    }
                }
                else if (result.key === 'creation_date')
                {
                    item.created = new Date(parseInt(result.value, 10) * 1000);
                }
                else if (result.key === 'metadata')
                {
                    if (result.value.includes('|'))
                    {
                        item.metadata = result.value.substring(0, result.value.indexOf('|'));
                    }
                    else
                    {
                        contMetadata = true;
                        item.metadata = result.value;
                    }
                }
                else
                {
                    console.log('Unrecognised key (2): ' + result.key);
                }
            }
        }
        return item;
    }

    public static async fromXML(xml: string): Promise<InventoryItem>
    {
        const parsed = await Utils.parseXML(xml);

        if (!parsed.InventoryItem)
        {
            throw new Error('InventoryItem not found');
        }
        const inventoryItem = new InventoryItem();
        const result = parsed.InventoryItem;
        let prop: any = null;
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
        if ((prop = Utils.getFromXMLJS(result, 'Type')) !== undefined)
        {
            inventoryItem.type = parseInt(prop, 10);
        }
        if ((prop = Utils.getFromXMLJS(result, 'ScriptRunning')) !== undefined)
        {
            inventoryItem.scriptRunning = prop === true;
        }
        if ((prop = Utils.getFromXMLJS(result, 'ScriptMono')) !== undefined)
        {
            inventoryItem.scriptMono = prop === true;
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

    public toAsset(indent = ''): string
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
        lines.push('\ttype\t' + AssetTypeRegistry.getTypeName(this.type));
        lines.push('\tinv_type\t' + InventoryTypeRegistry.getTypeName(this.inventoryType));
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

    public getCRC(): number
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

    public async update(): Promise<void>
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
            GroupOwned: this.permissions.groupOwned ?? false,
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

    public async moveToFolder(targetFolder: InventoryFolder): Promise<InventoryItem>
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

    public async delete(): Promise<void>
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

    // noinspection JSUnusedGlobalSymbols
    public exportXML(): string
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
        if (this.type === AssetType.LSLText)
        {
            document.ele('ScriptRunning', this.scriptRunning);
            document.ele('ScriptMono', this.scriptMono);
        }
        return document.end({ pretty: true, allowEmpty: true });
    }

    // noinspection JSUnusedGlobalSymbols
    public async detachFromAvatar(): Promise<void>
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

    // noinspection JSUnusedGlobalSymbols
    public async attachToAvatar(attachPoint: AttachmentPoint, timeout = 10000): Promise<GameObject>
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

    // noinspection JSUnusedGlobalSymbols
    public async rezGroupInWorld(position: Vector3): Promise<GameObject[]>
    {
        return new Promise<GameObject[]>((resolve, reject) =>
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

            objSub = this.agent.currentRegion.clientEvents.onNewObjectEvent.subscribe((evt: NewObjectEvent) =>
            {
                (async(): Promise<void> =>
                {
                    if (evt.createSelected && !evt.object.resolvedAt)
                    {
                        // We need to get the full ObjectProperties so we can be sure this is or isn't a rez from inventory
                        await agent.currentRegion.clientCommands.region.resolveObject(evt.object, {});
                    }
                    if (evt.createSelected && !evt.object.claimedForBuild)
                    {
                        if (evt.object.itemID?.equals(this.itemID))
                        {
                            evt.object.claimedForBuild = true;
                            gotObjects.push(evt.object);
                        }
                    }
                })().catch((_e: unknown) => {
                    // ignore
                });
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
            this.agent.currentRegion.clientCommands.agent.setCamera(camLocation, position, 256, new Vector3([-1.0, 0, 0]), new Vector3([0.0, 1.0, 0]));
            this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
        });
    }

    public async rezInWorld(position: Vector3, objectScale?: Vector3): Promise<GameObject>
    {
        return new Promise<GameObject>((resolve, reject) =>
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
            objSub = this.agent.currentRegion.clientEvents.onNewObjectEvent.subscribe((evt: NewObjectEvent) =>
            {
                (async(): Promise<void> =>
                {
                    if (evt.createSelected && !evt.object.resolvedAt)
                    {
                        // We need to get the full ObjectProperties so we can be sure this is or isn't a rez from inventory
                        await agent.currentRegion.clientCommands.region.resolveObject(evt.object, {});
                    }
                    if (evt.createSelected && !evt.object.claimedForBuild && !claimedPrim)
                    {
                        if (evt.object.itemID?.equals(this.itemID))
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
                })().catch((_e: unknown) =>
                {
                    // ignore
                });
            });

            // Move the camera to look directly at prim for faster capture
            let height = 10;
            if (objectScale !== undefined)
            {
                height = objectScale.z;
            }
            const camLocation = new Vector3(position);
            camLocation.z += (height / 2) + 1;
            this.agent.currentRegion.clientCommands.agent.setCamera(camLocation, position, height, new Vector3([-1.0, 0, 0]), new Vector3([0.0, 1.0, 0]));
            this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    public async rename(newName: string): Promise<void>
    {
        this.name = newName;
        if (this.agent === undefined)
        {
            return;
        }
        if (this.container instanceof GameObject)
        {
            const msg = new UpdateTaskInventoryMessage();
            if (this.description == '')
            {
                this.description = '(No Description)';
            }
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.agent.currentRegion.circuit.sessionID
            };
            msg.UpdateData = {
                Key: 0,
                LocalID: this.container.ID
            };
            msg.InventoryData = {
                ItemID: this.itemID,
                FolderID: this.parentID,
                CreatorID: this.permissions.creator,
                OwnerID: this.agent.agentID,
                GroupID: this.permissions.group,
                BaseMask: this.permissions.baseMask,
                OwnerMask: this.permissions.ownerMask,
                GroupMask: this.permissions.groupMask,
                EveryoneMask: this.permissions.everyoneMask,
                NextOwnerMask: this.permissions.nextOwnerMask,
                GroupOwned: this.permissions.groupOwned ?? false,
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
        else if (this.container instanceof InventoryFolder)
        {
            this.name = newName;
            return this.update();
        }
        else
        {
            throw new Error('Item has no container, cannot be renamed');
        }
    }

    // noinspection JSUnusedGlobalSymbols
    public async isScriptRunning(): Promise<boolean>
    {
        if (this.type !== AssetType.LSLText)
        {
            throw new Error('Item is not a script');
        }
        if (!(this.container instanceof GameObject))
        {
            throw new Error('Script can only be running inside a GameObject container')
        }

        const isr = new GetScriptRunningMessage();
        isr.Script = {
            ObjectID: this.container.FullID,
            ItemID: this.itemID
        };
        const objID = this.container.FullID;


        const event = this.container.region.clientEvents.waitForEvent(this.container.region.clientEvents.onScriptRunningReply, (evt): FilterResponse =>
        {
            if (evt.ItemID.equals(this.itemID) &&
                evt.ObjectID.equals(objID))
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        });
        const legacy = this.container.region.circuit.sendAndWaitForMessage<ScriptRunningReplyMessage>(isr, PacketFlags.Reliable, Message.ScriptRunningReply, 10000, (message: ScriptRunningReplyMessage) =>
        {
            if (message.Script.ItemID.equals(this.itemID) &&
                message.Script.ObjectID.equals(objID))
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        });
        const result = await Promise.race([event, legacy]);
        if (result instanceof ScriptRunningReplyMessage)
        {
            this.scriptRunning = result.Script.Running
        }
        else
        {
            this.scriptRunning = result.Running;
            this.scriptMono = result.Mono;
        }
        return this.scriptRunning;
    }

    public async copyTo(target: InventoryFolder, name: string): Promise<InventoryItem>
    {
        const msg = new CopyInventoryItemMessage();
        if (this.agent === undefined)
        {
            throw new Error('No active agent');
        }
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.agent.currentRegion.circuit.sessionID
        };

        const bytes = crypto.randomBytes(4);
        const callbackID = bytes.readUInt32LE(0);
        msg.InventoryData = [{
            CallbackID: callbackID,
            OldAgentID: this.agent.agentID,
            OldItemID: this.itemID,
            NewFolderID: target.folderID,
            NewName: Utils.StringToBuffer(name)
        }];
        this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
        const cbMsg = await this.waitForCallbackID(callbackID);

        for (const cbItem of cbMsg.itemData)
        {
            if (cbItem.callbackID === callbackID)
            {
                const item = await this.agent.inventory.fetchInventoryItem(cbItem.itemID);
                if (item !== null)
                {
                    return item;
                }
            }
        }

        throw new Error('Unable to locate inventory item after copy');
    }

    // noinspection JSUnusedGlobalSymbols
    public async updateScript(scriptAsset: Buffer, running = true, target: 'mono' | 'lsl2' = 'mono'): Promise<UUID>
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
                    'is_script_running': running ? 1 : 0,
                    'target': target
                });
                if (result.uploader)
                {
                    const uploader = result.uploader;
                    const uploadResult: any = await this.agent.currentRegion.caps.capsRequestUpload(uploader, scriptAsset);
                    if (uploadResult.state && uploadResult.state === 'complete')
                    {
                        return new UUID(uploadResult.new_asset.toString());
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

    public async setScriptRunning(running: boolean): Promise<void>
    {
        if (this.agent === undefined)
        {
            throw new Error('This item was created locally and can\'t be updated');
        }
        if (this.type !== AssetType.LSLText)
        {
            throw new Error('This is not a script');
        }
        if (this.container instanceof GameObject)
        {
            const msg = new SetScriptRunningMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.agent.currentRegion.circuit.sessionID,
            };
            msg.Script = {
                ObjectID: this.container.FullID,
                ItemID: this.itemID,
                Running: running
            };
            const ack = this.agent.currentRegion.circuit.sendMessage(msg, PacketFlags.Reliable);
            return this.agent.currentRegion.circuit.waitForAck(ack, 10000);
        }
        else
        {
            throw new Error('Script must be in an object to set state')
        }
    }

    private async waitForCallbackID(callbackID: number): Promise<BulkUpdateInventoryEvent>
    {
        if (!this.agent)
        {
            throw new Error('No active agent');
        }
        return Utils.waitOrTimeOut<BulkUpdateInventoryEvent>(this.agent.currentRegion.clientEvents.onBulkUpdateInventoryEvent, 10000, (event: BulkUpdateInventoryEvent) =>
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
    }
}
