import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import { RegionHandleRequestMessage } from '../messages/RegionHandleRequest';
import { Message } from '../../enums/Message';
import { FilterResponse } from '../../enums/FilterResponse';
import { RegionIDAndHandleReplyMessage } from '../messages/RegionIDAndHandleReply';
import { ObjectGrabMessage } from '../messages/ObjectGrab';
import { ObjectDeGrabMessage } from '../messages/ObjectDeGrab';
import { ObjectGrabUpdateMessage } from '../messages/ObjectGrabUpdate';
import { ObjectSelectMessage } from '../messages/ObjectSelect';
import { ObjectPropertiesMessage } from '../messages/ObjectProperties';
import { Utils } from '../Utils';
import { ObjectDeselectMessage } from '../messages/ObjectDeselect';
import { RequestTaskInventoryMessage } from '../messages/RequestTaskInventory';
import { ReplyTaskInventoryMessage } from '../messages/ReplyTaskInventory';
import { InventoryItem } from '../InventoryItem';
import { AssetTypeLL } from '../../enums/AssetTypeLL';
import { SaleTypeLL } from '../../enums/SaleTypeLL';
import { InventoryTypeLL } from '../../enums/InventoryTypeLL';
import { ObjectAddMessage } from '../messages/ObjectAdd';
import { Quaternion } from '../Quaternion';
import { RezObjectMessage } from '../messages/RezObject';
import { PermissionMask } from '../../enums/PermissionMask';
import { PacketFlags } from '../../enums/PacketFlags';
import { GameObject } from '../public/GameObject';
import { PCode } from '../../enums/PCode';
import { PrimFlags } from '../../enums/PrimFlags';
import { AssetType } from '../../enums/AssetType';
import { NewObjectEvent } from '../../events/NewObjectEvent';
import { Vector3 } from '../Vector3';
import { Parcel } from '../public/Parcel';

import * as Long from 'long';
import * as micromatch from 'micromatch';
import * as LLSD from '@caspertech/llsd';
import { Subject, Subscription } from 'rxjs';
import { SculptType } from '../..';
import { ObjectResolvedEvent } from '../../events/ObjectResolvedEvent';
import { AssetMap } from '../AssetMap';
import { InventoryType } from '../../enums/InventoryType';
import { BuildMap } from '../BuildMap';
import Timer = NodeJS.Timer;
import Timeout = NodeJS.Timeout;

export class RegionCommands extends CommandsBase
{
    private resolveQueue: {[key: number]: GameObject} = {};

    async getRegionHandle(regionID: UUID): Promise<Long>
    {
        const circuit = this.currentRegion.circuit;
        const msg: RegionHandleRequestMessage = new RegionHandleRequestMessage();
        msg.RequestBlock = {
            RegionID: regionID,
        };
        circuit.sendMessage(msg, PacketFlags.Reliable);
        const responseMsg: RegionIDAndHandleReplyMessage = await circuit.waitForMessage<RegionIDAndHandleReplyMessage>(Message.RegionIDAndHandleReply, 10000, (filterMsg: RegionIDAndHandleReplyMessage): FilterResponse =>
        {
            if (filterMsg.ReplyBlock.RegionID.toString() === regionID.toString())
            {
                return FilterResponse.Finish;
            }
            else
            {
                return FilterResponse.NoMatch;
            }
        });
        return responseMsg.ReplyBlock.RegionHandle;
    }

    waitForHandshake(timeout: number = 10000): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.currentRegion.handshakeComplete)
            {
                resolve();
            }
            else
            {
                let handshakeSubscription: Subscription | undefined;
                let timeoutTimer: number | undefined;
                handshakeSubscription = this.currentRegion.handshakeCompleteEvent.subscribe(() =>
                {
                    if (timeoutTimer !== undefined)
                    {
                        clearTimeout(timeoutTimer);
                        timeoutTimer = undefined;
                    }
                    if (handshakeSubscription !== undefined)
                    {
                        handshakeSubscription.unsubscribe();
                        handshakeSubscription = undefined;
                        resolve();
                    }
                });
                timeoutTimer = setTimeout(() =>
                {
                    if (handshakeSubscription !== undefined)
                    {
                        handshakeSubscription.unsubscribe();
                        handshakeSubscription = undefined;
                    }
                    if (timeoutTimer !== undefined)
                    {
                        clearTimeout(timeoutTimer);
                        timeoutTimer = undefined;
                        reject(new Error('Timeout'));
                    }
                }, timeout) as any as number;
                if (this.currentRegion.handshakeComplete)
                {
                    if (handshakeSubscription !== undefined)
                    {
                        handshakeSubscription.unsubscribe();
                        handshakeSubscription = undefined;
                    }
                    if (timeoutTimer !== undefined)
                    {
                        clearTimeout(timeoutTimer);
                        timeoutTimer = undefined;
                    }
                    resolve();
                }
            }
        });
    }

    async deselectObjects(objects: GameObject[])
    {
        // Limit to 255 objects at once
        const selectLimit = 255;
        if (objects.length > selectLimit)
        {
            for (let x = 0; x < objects.length; x += selectLimit)
            {
                const selectList: GameObject[] = [];
                for (let y = 0; y < selectLimit; y++)
                {
                    if (y < objects.length)
                    {
                        selectList.push(objects[x + y]);
                    }
                }
                await this.deselectObjects(selectList);
            }
            return;
        }
        else
        {
            const deselectObject = new ObjectDeselectMessage();
            deselectObject.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            deselectObject.ObjectData = [];
            const uuidMap: {[key: string]: GameObject} = {};
            for (const obj of objects)
            {
                const uuidStr = obj.FullID.toString();
                if (!uuidMap[uuidStr])
                {
                    uuidMap[uuidStr] = obj;
                    deselectObject.ObjectData.push({
                        ObjectLocalID: obj.ID
                    });
                }
            }

            // Create a map of our expected UUIDs

            const sequenceID = this.circuit.sendMessage(deselectObject, PacketFlags.Reliable);
            return await this.circuit.waitForAck(sequenceID, 10000);
        }
    }

    countObjects(): number
    {
        return this.currentRegion.objects.getNumberOfObjects();
    }

    getTerrainTextures(): UUID[]
    {
        const textures: UUID[] = [];
        textures.push(this.currentRegion.terrainDetail0);
        textures.push(this.currentRegion.terrainDetail1);
        textures.push(this.currentRegion.terrainDetail2);
        textures.push(this.currentRegion.terrainDetail3);
        return textures;
    }

    exportSettings(): string
    {
        return this.currentRegion.exportXML();
    }

    async getTerrain()
    {
        await this.currentRegion.waitForTerrain();
        const buf = Buffer.allocUnsafe(262144);
        let pos = 0;
        for (let x = 0; x < 256; x++)
        {
            for (let y = 0; y < 256; y++)
            {
                buf.writeFloatLE(this.currentRegion.terrain[x][y], pos);
                pos = pos + 4;
            }
        }
        return buf;
    }

    async selectObjects(objects: GameObject[])
    {
        // Limit to 255 objects at once
        const selectLimit = 255;
        if (objects.length > selectLimit)
        {
            for (let x = 0; x < objects.length; x += selectLimit)
            {
                const selectList: GameObject[] = [];
                for (let y = 0; y < selectLimit; y++)
                {
                    if (y < objects.length)
                    {
                        selectList.push(objects[x + y]);
                    }
                }
                await this.selectObjects(selectList);
            }
            return;
        }
        else
        {
            const selectObject = new ObjectSelectMessage();
            selectObject.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            selectObject.ObjectData = [];
            const uuidMap: {[key: string]: GameObject} = {};
            for (const obj of objects)
            {
                const uuidStr = obj.FullID.toString();
                if (!uuidMap[uuidStr])
                {
                    uuidMap[uuidStr] = obj;
                    selectObject.ObjectData.push({
                        ObjectLocalID: obj.ID
                    });
                }
            }

            // Create a map of our expected UUIDs
            let resolved =  0;

            this.circuit.sendMessage(selectObject, PacketFlags.Reliable);
            const unresolved = [];
            try
            {
                const results = await this.circuit.waitForMessage<ObjectPropertiesMessage>(Message.ObjectProperties, 10000, (propertiesMessage: ObjectPropertiesMessage): FilterResponse =>
                {
                    let found = false;
                    for (const objData of propertiesMessage.ObjectData)
                    {
                        const objDataUUID = objData.ObjectID.toString();
                        if (uuidMap[objDataUUID] !== undefined)
                        {
                            resolved++;
                            const obj = uuidMap[objDataUUID];
                            obj.creatorID = objData.CreatorID;
                            obj.creationDate = objData.CreationDate;
                            obj.baseMask = objData.BaseMask;
                            obj.ownerMask = objData.OwnerMask;
                            obj.groupMask = objData.GroupMask;
                            obj.everyoneMask = objData.EveryoneMask;
                            obj.nextOwnerMask = objData.NextOwnerMask;
                            obj.ownershipCost = objData.OwnershipCost;
                            obj.saleType = objData.SaleType;
                            obj.salePrice = objData.SalePrice;
                            obj.aggregatePerms = objData.AggregatePerms;
                            obj.aggregatePermTextures = objData.AggregatePermTextures;
                            obj.aggregatePermTexturesOwner = objData.AggregatePermTexturesOwner;
                            obj.category = objData.Category;
                            obj.inventorySerial = objData.InventorySerial;
                            obj.itemID = objData.ItemID;
                            obj.folderID = objData.FolderID;
                            obj.fromTaskID = objData.FromTaskID;
                            obj.groupID = objData.GroupID;
                            obj.lastOwnerID = objData.LastOwnerID;
                            obj.name = Utils.BufferToStringSimple(objData.Name);
                            obj.description = Utils.BufferToStringSimple(objData.Description);
                            obj.touchName = Utils.BufferToStringSimple(objData.TouchName);
                            obj.sitName = Utils.BufferToStringSimple(objData.SitName);
                            obj.textureID = Utils.BufferToStringSimple(objData.TextureID);
                            obj.resolvedAt = new Date().getTime() / 1000;
                            delete uuidMap[objDataUUID];
                            found = true;
                        }
                    }
                    if (Object.keys(uuidMap).length === 0)
                    {
                        return FilterResponse.Finish;
                    }
                    if (!found)
                    {
                        return FilterResponse.NoMatch;
                    }
                    else
                    {
                        return FilterResponse.Match;
                    }
                });
            }
            catch (error)
            {

            }
            finally
            {

                for (const obj of objects)
                {
                   if (obj.resolvedAt === undefined || obj.name === undefined)
                   {
                       obj.resolveAttempts++;
                   }
                }
            }
        }
    }

    private parseLine(line: string): {
        'key': string | null,
        'value': string
    }
    {
        line = line.trim().replace(/[\t]/gu, ' ').trim();
        while (line.indexOf('\u0020\u0020') > 0)
        {
            line = line.replace(/\u0020\u0020/gu, '\u0020');
        }
        let key: string | null = null;
        let value = '';
        if (line.length > 2)
        {
            const sep = line.indexOf(' ');
            if (sep > 0)
            {
                key = line.substr(0, sep);
                value = line.substr(sep + 1);
            }
        }
        else if (line.length === 1)
        {
            key = line;
        }
        else if (line.length > 0)
        {
            return {
                'key': line,
                'value': ''
            }
        }
        if (key !== null)
        {
            key = key.trim();
        }
        return {
            'key': key,
            'value': value
        }
    }

    getName(): string
    {
        return this.currentRegion.regionName;
    }

    private waitForObjectResolve(localID: number)
    {
        return new Promise((resolve, reject) =>
        {
            let timeout: Timeout | undefined = undefined;
            let subs: Subscription | undefined = undefined;
            try
            {
                const ourObject = this.currentRegion.objects.getObjectByLocalID(localID);
                if (ourObject.resolvedAt)
                {
                    resolve();
                    return;
                }
            }
            catch (ignore)
            {

            }
            subs = this.currentRegion.clientEvents.onObjectResolvedEvent.subscribe((evt: ObjectResolvedEvent) =>
            {
                if (evt.object.ID === localID)
                {
                    if (timeout !== undefined)
                    {
                        clearTimeout(timeout);
                        timeout = undefined;
                    }
                    if (subs !== undefined)
                    {
                        subs.unsubscribe();
                        subs = undefined;
                    }
                    resolve();
                }
            });
            timeout = setTimeout(() =>
            {
                if (timeout !== undefined)
                {
                    clearTimeout(timeout);
                    timeout = undefined;
                }
                if (subs !== undefined)
                {
                    subs.unsubscribe();
                    subs = undefined;
                }
                const object = this.currentRegion.objects.getObjectByLocalID(localID);
                if (object.resolvedAt)
                {
                    try
                    {
                        const ourObject = this.currentRegion.objects.getObjectByLocalID(localID);
                        if (ourObject.resolvedAt)
                        {
                            console.warn('Resolve timed out but object ' + localID + ' HAS been resolved!');
                            resolve();
                            return;
                        }
                    }
                    catch (ignore)
                    {

                    }
                }
                reject(new Error('Timeout'));
            }, 10000);
        });
    }

    private async queueResolveObject(object: GameObject, skipInventory = false)
    {
        if (object.resolvedAt)
        {
            return;
        }
        if (this.resolveQueue[object.ID] === undefined)
        {
            this.resolveQueue[object.ID] = object;
            try
            {
                await this.resolveObjects([object], true, true);
            }
            catch (error)
            {
                console.error('Failed to resolve ' + object.ID);
            }
            delete this.resolveQueue[object.ID];
        }
        else
        {
            return this.waitForObjectResolve(object.ID);
        }
    }

    private async resolveObjects(objects: GameObject[], onlyUnresolved: boolean = false, skipInventory = false)
    {
        // First, create a map of all object IDs
        const objs: {[key: number]: GameObject} = {};
        const scanObject = function(obj: GameObject)
        {
            const localID = obj.ID;
            if (!objs[localID])
            {
                objs[localID] = obj;
                if (obj.children)
                {
                    for (const child of obj.children)
                    {
                        scanObject(child);
                    }
                }
            }
        };
        for (const obj of objects)
        {
            scanObject(obj);
        }

        const resolveTime = new Date().getTime() / 1000;
        let objectList = [];
        let totalRemaining = 0;
        try
        {
            for (const k of Object.keys(objs))
            {
                const ky = parseInt(k, 10);
                if (objs[ky] !== undefined)
                {
                    const o = objs[ky];
                    if (o.resolvedAt === undefined)
                    {
                        o.resolvedAt = 0;
                    }
                    if (o.resolvedAt !== undefined && o.resolvedAt < resolveTime && o.PCode !== PCode.Avatar && o.resolveAttempts < 3 && (o.Flags === undefined || !(o.Flags & PrimFlags.TemporaryOnRez)))
                    {
                        totalRemaining++;
                        if (!onlyUnresolved || objs[ky].name === undefined)
                        {
                            objs[ky].name = undefined;
                            objectList.push(objs[ky]);
                        }
                        if (objectList.length > 254)
                        {
                            try
                            {
                                await this.selectObjects(objectList);
                                await this.deselectObjects(objectList);
                                for (const chk of objectList)
                                {
                                    if (chk.resolvedAt !== undefined && chk.resolvedAt >= resolveTime)
                                    {
                                        totalRemaining--;
                                    }
                                }
                            }
                            catch (ignore)
                            {

                            }
                            finally
                            {
                                objectList = [];
                            }
                        }
                    }
                }
            }
            if (objectList.length > 0)
            {
                await this.selectObjects(objectList);
                await this.deselectObjects(objectList);
                for (const chk of objectList)
                {
                    if (chk.resolvedAt !== undefined && chk.resolvedAt >= resolveTime)
                    {
                        totalRemaining --;
                    }
                }
            }
            const objectSet = Object.keys(objs);
            let count = 0;
            for (const k of objectSet)
            {
                count++;
                const ky = parseInt(k, 10);
                if (objs[ky] !== undefined && !skipInventory)
                {
                    const o = objs[ky];
                    if ((o.resolveAttempts === undefined || o.resolveAttempts < 3) && o.FullID !== undefined && o.name !== undefined && o.Flags !== undefined && !(o.Flags & PrimFlags.InventoryEmpty) && (!o.inventory || o.inventory.length === 0))
                    {
                        const req = new RequestTaskInventoryMessage();
                        req.AgentData = {
                            AgentID: this.agent.agentID,
                            SessionID: this.circuit.sessionID
                        };
                        req.InventoryData = {
                            LocalID: o.ID
                        };
                        this.circuit.sendMessage(req, PacketFlags.Reliable);
                        try
                        {
                            const inventory = await this.circuit.waitForMessage<ReplyTaskInventoryMessage>(Message.ReplyTaskInventory, 10000, (message: ReplyTaskInventoryMessage): FilterResponse =>
                            {
                                if (message.InventoryData.TaskID.equals(o.FullID))
                                {
                                    return FilterResponse.Finish;
                                }
                                else
                                {
                                    return FilterResponse.Match;
                                }
                            });
                            const fileName = Utils.BufferToStringSimple(inventory.InventoryData.Filename);

                            const file = await this.circuit.XferFile(fileName, true, false, UUID.zero(), AssetType.Unknown, true);
                            if (file.length === 0)
                            {
                                o.Flags = o.Flags | PrimFlags.InventoryEmpty;
                            }
                            else
                            {
                                let str = file.toString('utf-8');
                                let nl = str.indexOf('\0');
                                while (nl !== -1)
                                {
                                    str = str.substr(nl + 1);
                                    nl = str.indexOf('\0')
                                }
                                const lines: string[] = str.replace(/\r\n/g, '\n').split('\n');
                                let lineNum = 0;
                                while (lineNum < lines.length)
                                {
                                    let line = lines[lineNum++];
                                    let result = this.parseLine(line);
                                    if (result.key !== null)
                                    {
                                        switch (result.key)
                                        {
                                            case 'inv_object':
                                                let itemID = UUID.zero();
                                                let parentID = UUID.zero();
                                                let name = '';
                                                let assetType: AssetType = AssetType.Unknown;

                                                while (lineNum < lines.length)
                                                {
                                                    result = this.parseLine(lines[lineNum++]);
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
                                                        else if (result.key === 'obj_id')
                                                        {
                                                            itemID = new UUID(result.value);
                                                        }
                                                        else if (result.key === 'parent_id')
                                                        {
                                                            parentID = new UUID(result.value);
                                                        }
                                                        else if (result.key === 'type')
                                                        {
                                                            const typeString = result.value as any;
                                                            assetType = parseInt(AssetTypeLL[typeString], 10);
                                                        }
                                                        else if (result.key === 'name')
                                                        {
                                                            name = result.value.substr(0, result.value.indexOf('|'));
                                                        }
                                                    }
                                                }

                                                if (name !== 'Contents')
                                                {
                                                    console.log('TODO: Do something useful with inv_objects')
                                                }

                                                break;
                                            case 'inv_item':
                                                const item: InventoryItem = new InventoryItem();
                                                while (lineNum < lines.length)
                                                {
                                                    line = lines[lineNum++];
                                                    result = this.parseLine(line);
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
                                                            while (lineNum < lines.length)
                                                            {
                                                                result = this.parseLine(lines[lineNum++]);
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
                                                            while (lineNum < lines.length)
                                                            {
                                                                result = this.parseLine(lines[lineNum++]);
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
                                                            item.assetID = new UUID(result.value).bitwiseOr(new UUID('3c115e51-04f4-523c-9fa6-98aff1034730'));
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
                                                            const typeString = result.value as any;
                                                            item.inventoryType = parseInt(InventoryTypeLL[typeString], 10);
                                                        }
                                                        else if (result.key === 'flags')
                                                        {
                                                            item.flags = parseInt(result.value, 10);
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
                                                o.inventory.push(item);
                                                break;
                                            default:
                                            {
                                                console.log('Unrecognised task inventory token: [' + result.key + ']');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        catch (error)
                        {
                            if (o.resolveAttempts === undefined)
                            {
                                o.resolveAttempts = 0;
                            }
                            o.resolveAttempts++;
                            if (o.FullID !== undefined)
                            {
                                console.error('Error downloading task inventory of ' + o.FullID.toString() + ':');
                                console.error(error);
                            }
                            else
                            {
                                console.error('Error downloading task inventory of ' + o.ID + ':');
                                console.error(error);
                            }
                        }
                    }
                }
            }
        }
        catch (ignore)
        {
            console.error(ignore);
        }
        finally
        {
            if (totalRemaining < 1)
            {
                totalRemaining = 0;
                for (const obj of objectList)
                {
                    if (obj.resolvedAt === undefined || obj.resolvedAt < resolveTime)
                    {
                        totalRemaining++;
                    }
                }
                if (totalRemaining > 0)
                {
                    console.error(totalRemaining + ' objects could not be resolved');
                }
            }
            const that  = this;
            const getCosts = async function(objIDs: UUID[])
            {
                const result = await that.currentRegion.caps.capsPostXML('GetObjectCost', {
                    'object_ids': objIDs
                });
                const uuids = Object.keys(result);
                for (const key of uuids)
                {
                    const costs = result[key];
                    try
                    {
                        const obj: GameObject = that.currentRegion.objects.getObjectByUUID(new UUID(key));
                        obj.linkPhysicsImpact = parseFloat(costs['linked_set_physics_cost']);
                        obj.linkResourceImpact = parseFloat(costs['linked_set_resource_cost']);
                        obj.physicaImpact = parseFloat(costs['physics_cost']);
                        obj.resourceImpact = parseFloat(costs['resource_cost']);
                        obj.limitingType = costs['resource_limiting_type'];


                        obj.landImpact = Math.round(obj.linkPhysicsImpact);
                        if (obj.linkResourceImpact > obj.linkPhysicsImpact)
                        {
                            obj.landImpact = Math.round(obj.linkResourceImpact);
                        }
                        obj.calculatedLandImpact = obj.landImpact;
                        if (obj.Flags !== undefined && obj.Flags & PrimFlags.TemporaryOnRez && obj.limitingType === 'legacy')
                        {
                            obj.calculatedLandImpact = 0;
                        }
                    }
                    catch (error)
                    {}
                }
            };

            let ids: UUID[] = [];
            const promises: Promise<void>[] = [];
            for (const obj of objects)
            {
                if (!onlyUnresolved || obj.landImpact === undefined)
                {
                    ids.push(new LLSD.UUID(obj.FullID));
                }
                if (ids.length > 255)
                {
                    promises.push(getCosts(ids));
                    ids = [];
                }
            }
            if (ids.length > 0)
            {
                promises.push(getCosts(ids));
            }
            await Promise.all(promises);
        }
    }

    private waitForObjectByLocalID(localID: number, timeout: number): Promise<GameObject>
    {
        return new Promise<GameObject>((resolve, reject) =>
        {
            let tmr: Timer | null = null;
            const subscription = this.currentRegion.clientEvents.onNewObjectEvent.subscribe(async (event: NewObjectEvent) =>
            {
                if (event.localID === localID)
                {
                    if (tmr !== null)
                    {
                        clearTimeout(tmr);
                    }
                    subscription.unsubscribe();
                    resolve(event.object);
                }
            });
            tmr = setTimeout(() =>
            {
                subscription.unsubscribe();
                reject(new Error('Timeout'));
            }, timeout)
        });
    }

    private waitForObjectByUUID(objectID: UUID, timeout: number): Promise<GameObject>
    {
        return new Promise<GameObject>((resolve, reject) =>
        {
            let tmr: Timer | null = null;
            const subscription = this.currentRegion.clientEvents.onNewObjectEvent.subscribe(async (event: NewObjectEvent) =>
            {
                if (event.objectID.equals(objectID))
                {
                    if (tmr !== null)
                    {
                        clearTimeout(tmr);
                    }
                    subscription.unsubscribe();
                    resolve(event.object);
                }
            });
            tmr = setTimeout(() =>
            {
                subscription.unsubscribe();
                reject(new Error('Timeout'));
            }, timeout)
        });
    }

    private async buildPart(obj: GameObject, posOffset: Vector3, rotOffset: Quaternion, buildMap: BuildMap)
    {
        // Calculate geometry
        const objectPosition = new Vector3(obj.Position);
        const objectRotation = new Quaternion(obj.Rotation);
        const objectScale = new Vector3(obj.Scale);

        let finalPos = Vector3.getZero();
        let finalRot = Quaternion.getIdentity();
        if (posOffset.x === 0.0 && posOffset.y === 0.0 && posOffset.z === 0.0 && objectPosition !== undefined)
        {
            finalPos = new Vector3(objectPosition);
            finalRot = new Quaternion(objectRotation);
        }
        else
        {
            const adjustedPos = new Vector3(objectPosition).multiplyByQuat(new Quaternion(rotOffset));
            finalPos = new Vector3(new Vector3(posOffset).add(adjustedPos));

            const baseRot = new Quaternion(rotOffset);
            finalRot = new Quaternion(baseRot.multiply(new Quaternion(objectRotation)));
        }

        // Is this a mesh part?
        let object: GameObject | null = null;
        if (obj.extraParams !== undefined && obj.extraParams.meshData !== null)
        {
            if (buildMap.assetMap.mesh[obj.extraParams.meshData.meshData.toString()] !== undefined)
            {
                const meshEntry = buildMap.assetMap.mesh[obj.extraParams.meshData.meshData.toString()];
                const rezLocation = new Vector3(buildMap.rezLocation);
                rezLocation.z += (objectScale.z / 2);

                object = await this.rezFromInventory(obj, rezLocation, new UUID(meshEntry.assetID));
            }
        }
        else if (buildMap.primReservoir.length > 0)
        {
            const newPrim = buildMap.primReservoir.shift();
            if (newPrim !== undefined)
            {
                object = newPrim;
                await object.setShape(
                    obj.PathCurve,
                    obj.ProfileCurve,
                    obj.PathBegin,
                    obj.PathEnd,
                    obj.PathScaleX,
                    obj.PathScaleY,
                    obj.PathShearX,
                    obj.PathShearY,
                    obj.PathTwist,
                    obj.PathTwistBegin,
                    obj.PathRadiusOffset,
                    obj.PathTaperX,
                    obj.PathTaperY,
                    obj.PathRevolutions,
                    obj.PathSkew,
                    obj.ProfileBegin,
                    obj.ProfileEnd,
                    obj.ProfileHollow
                );
            }
        }

        if (object === null)
        {
            throw new Error('Failed to acquire prim for build');
        }

        await object.setGeometry(finalPos, finalRot, objectScale);

        if (obj.extraParams.sculptData !== null)
        {
            if (obj.extraParams.sculptData.type !== SculptType.Mesh)
            {
                const oldTextureID = obj.extraParams.sculptData.texture.toString();
                if (buildMap.assetMap.textures[oldTextureID] !== undefined)
                {
                    obj.extraParams.sculptData.texture = new UUID(buildMap.assetMap.textures[oldTextureID]);
                }
            }
        }
        await object.setExtraParams(obj.extraParams);

        if (obj.TextureEntry !== undefined)
        {
            if (obj.TextureEntry.defaultTexture !== null)
            {
                const oldTextureID = obj.TextureEntry.defaultTexture.textureID.toString();
                if (buildMap.assetMap.textures[oldTextureID] !== undefined)
                {
                    obj.TextureEntry.defaultTexture.textureID = new UUID(buildMap.assetMap.textures[oldTextureID]);
                }
            }
            for (const j of obj.TextureEntry.faces)
            {
                const oldTextureID = j.textureID.toString();
                if (buildMap.assetMap.textures[oldTextureID] !== undefined)
                {
                    j.textureID = new UUID(buildMap.assetMap.textures[oldTextureID]);
                }
            }

            try
            {
                await object.setTextureEntry(obj.TextureEntry);
            }
            catch (error)
            {
                console.error(error);
            }
        }

        if (obj.name !== undefined)
        {
            await object.setName(obj.name);
        }

        if (obj.description !== undefined)
        {
            await object.setDescription(obj.description);
        }

        for (const invItem of obj.inventory)
        {
            try
            {
                switch (invItem.inventoryType)
                {
                    case InventoryType.Clothing:
                    {
                        if (buildMap.assetMap.clothing[invItem.assetID.toString()] !== undefined)
                        {
                            const invItemID = buildMap.assetMap.clothing[invItem.assetID.toString()];
                            await object.dropInventoryIntoContents(new UUID(invItemID));
                        }
                        break;
                    }
                    case InventoryType.Bodypart:
                    {
                        if (buildMap.assetMap.bodyparts[invItem.assetID.toString()] !== undefined)
                        {
                            const invItemID = buildMap.assetMap.bodyparts[invItem.assetID.toString()];
                            await object.dropInventoryIntoContents(new UUID(invItemID));
                        }
                        break;
                    }
                    case InventoryType.Notecard:
                    {
                        if (buildMap.assetMap.notecards[invItem.assetID.toString()] !== undefined)
                        {
                            const invItemID = buildMap.assetMap.notecards[invItem.assetID.toString()];
                            await object.dropInventoryIntoContents(new UUID(invItemID));
                        }
                        break;
                    }
                    case InventoryType.Sound:
                    {
                        if (buildMap.assetMap.sounds[invItem.assetID.toString()] !== undefined)
                        {
                            const invItemID = buildMap.assetMap.sounds[invItem.assetID.toString()];
                            await object.dropInventoryIntoContents(new UUID(invItemID));
                        }
                        break;
                    }
                    case InventoryType.Gesture:
                    {
                        if (buildMap.assetMap.gestures[invItem.assetID.toString()] !== undefined)
                        {
                            const invItemID = buildMap.assetMap.gestures[invItem.assetID.toString()];
                            await object.dropInventoryIntoContents(new UUID(invItemID));
                        }
                        break;
                    }
                    case InventoryType.Landmark:
                    {
                        if (buildMap.assetMap.landmarks[invItem.assetID.toString()] !== undefined)
                        {
                            const invItemID = buildMap.assetMap.landmarks[invItem.assetID.toString()];
                            await object.dropInventoryIntoContents(new UUID(invItemID));
                        }
                        break;
                    }
                    case InventoryType.LSL:
                    {
                        if (buildMap.assetMap.scripts[invItem.assetID.toString()] !== undefined)
                        {
                            const invItemID = buildMap.assetMap.scripts[invItem.assetID.toString()];
                            await object.dropInventoryIntoContents(new UUID(invItemID));
                        }
                        break;
                    }
                    case InventoryType.Animation:
                    {
                        if (buildMap.assetMap.animations[invItem.assetID.toString()] !== undefined)
                        {
                            const invItemID = buildMap.assetMap.animations[invItem.assetID.toString()];
                            await object.dropInventoryIntoContents(new UUID(invItemID));
                        }
                        break;
                    }
                }
            }
            catch (error)
            {
                console.error(error);
            }
        }

        // Do nested objects last
        for (const invItem of obj.inventory)
        {
            try
            {
                switch (invItem.inventoryType)
                {
                    case InventoryType.Object:
                    {
                        if (buildMap.assetMap.objects[invItem.assetID.toString()] !== undefined)
                        {
                            const objectXML = buildMap.assetMap.objects[invItem.assetID.toString()];
                            if (objectXML !== null)
                            {
                                const taskObjectXML = await GameObject.fromXML(objectXML.toString('utf-8'));
                                const taskObject = await this.buildObjectNew(taskObjectXML, buildMap.callback, buildMap.costOnly);
                                if (taskObject !== null)
                                {
                                    const invItemUUID = await taskObject.takeToInventory();
                                    await object.dropInventoryIntoContents(invItemUUID);
                                }
                            }
                        }
                        break;
                    }
                }
            }
            catch (error)
            {
                console.error(error);
            }
        }
        return object;
    }

    private gatherAssets(obj: GameObject, buildMap: BuildMap)
    {
        if (obj.extraParams !== undefined)
        {
            if (obj.extraParams.meshData !== null)
            {
                buildMap.assetMap.mesh[obj.extraParams.meshData.meshData.toString()] = {
                    objectName: obj.name || 'Object',
                    objectDescription: obj.description || '(no description)',
                    assetID: obj.extraParams.meshData.meshData.toString()
                };
            }
            else
            {
                buildMap.primsNeeded++;
            }
            if (obj.extraParams.sculptData !== null)
            {
                if (obj.extraParams.sculptData.type !== SculptType.Mesh)
                {
                    buildMap.assetMap.textures[obj.extraParams.sculptData.texture.toString()] = obj.extraParams.sculptData.texture.toString();
                }
            }
            if (obj.TextureEntry !== undefined)
            {
                for (const j of obj.TextureEntry.faces)
                {
                    const textureID = j.textureID;
                    buildMap.assetMap.textures[textureID.toString()] = textureID.toString();
                }
                if (obj.TextureEntry.defaultTexture !== null)
                {
                    const textureID = obj.TextureEntry.defaultTexture.textureID;
                    buildMap.assetMap.textures[textureID.toString()] = textureID.toString();
                }
            }
            if (obj.inventory !== undefined)
            {
                for (const j of obj.inventory)
                {
                    switch (j.inventoryType)
                    {
                        case InventoryType.Animation:
                        {
                            buildMap.assetMap.animations[j.assetID.toString()] = j.assetID.toString();
                            break;
                        }
                        case InventoryType.Bodypart:
                        {
                            buildMap.assetMap.bodyparts[j.assetID.toString()] = j.assetID.toString();
                            break;
                        }
                        case InventoryType.CallingCard:
                        {
                            buildMap.assetMap.callingcards[j.assetID.toString()] = j.assetID.toString();
                            break;
                        }
                        case InventoryType.Clothing:
                        {
                            buildMap.assetMap.clothing[j.assetID.toString()] = j.assetID.toString();
                            break;
                        }
                        case InventoryType.Gesture:
                        {
                            buildMap.assetMap.gestures[j.assetID.toString()] = j.assetID.toString();
                            break;
                        }
                        case InventoryType.Landmark:
                        {
                            buildMap.assetMap.landmarks[j.assetID.toString()] = j.assetID.toString();
                            break;
                        }
                        case InventoryType.LSL:
                        {
                            buildMap.assetMap.scripts[j.assetID.toString()] = j.assetID.toString();
                            break;
                        }
                        case InventoryType.Snapshot:
                        {
                            buildMap.assetMap.textures[j.assetID.toString()] = j.assetID.toString();
                            break;
                        }
                        case InventoryType.Notecard:
                        {
                            buildMap.assetMap.notecards[j.assetID.toString()] = j.assetID.toString();
                            break;
                        }
                        case InventoryType.Sound:
                        {
                            buildMap.assetMap.sounds[j.assetID.toString()] = j.assetID.toString();
                            break;
                        }
                        case InventoryType.Object:
                        {
                            buildMap.assetMap.objects[j.assetID.toString()] = null;
                        }
                    }
                }
            }
        }
        if (obj.children)
        {
            for (const child of obj.children)
            {
                this.gatherAssets(child, buildMap);
            }
        }
    }

    async buildObjectNew(obj: GameObject, callback: (map: AssetMap) => void, costOnly: boolean = false): Promise<GameObject | null>
    {
        const map: AssetMap = new AssetMap();
        const  buildMap = new BuildMap(map, callback, costOnly);
        this.gatherAssets(obj, buildMap);
        await callback(map);

        if (costOnly)
        {
            return null;
        }

        let agentPos = new Vector3([128, 128, 2048]);
        try
        {
            const agentLocalID = this.currentRegion.agent.localID;
            const agentObject = this.currentRegion.objects.getObjectByLocalID(agentLocalID);
            if (agentObject.Position !== undefined)
            {
                agentPos = new Vector3(agentObject.Position);
            }
            else
            {
                throw new Error('Agent position is undefined');
            }
        }
        catch (error)
        {
            console.warn('Unable to find avatar location, rezzing at ' + agentPos.toString());
        }
        agentPos.z += 2.0;
        buildMap.rezLocation = agentPos;
        // Set camera above target location for fast acquisition
        const campos = new Vector3(agentPos);
        campos.z += 2.0;
        await this.currentRegion.clientCommands.agent.setCamera(campos, agentPos, 10, new Vector3([-1.0, 0, 0]), new Vector3([0.0, 1.0, 0]));

        if (buildMap.primsNeeded > 0)
        {
            buildMap.primReservoir = await this.createPrims(buildMap.primsNeeded, agentPos);
        }

        const parts = [];
        parts.push(this.buildPart(obj, Vector3.getZero(), Quaternion.getIdentity(), buildMap));

        if (obj.children)
        {
            if (obj.Position === undefined)
            {
                obj.Position = Vector3.getZero();
            }
            if (obj.Rotation === undefined)
            {
                obj.Rotation = Quaternion.getIdentity();
            }
            for (const child of obj.children)
            {
                if (child.Position !== undefined && child.Rotation !== undefined)
                {
                    const objPos = new Vector3(obj.Position);
                    const objRot = new Quaternion(obj.Rotation);
                    parts.push(this.buildPart(child, objPos, objRot, buildMap));
                }
            }
        }
        const results: GameObject[] = await Promise.all(parts);

        const rootObj = results[0];
        const childPrims: GameObject[] = [];
        for (const childObject of results)
        {
            if (childObject !== rootObj)
            {
                childPrims.push(childObject);
            }
        }
        await rootObj.linkFrom(childPrims);
        return rootObj;
    }

    private createPrims(count: number, position: Vector3)
    {
        return new Promise<GameObject[]>((resolve, reject) =>
        {
            const gatheredPrims: GameObject[] = [];
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
                reject(new Error('Failed to gather ' + count + ' prims - only gathered ' + gatheredPrims.length));
            }, 30000);
            objSub = this.currentRegion.clientEvents.onNewObjectEvent.subscribe(async (evt: NewObjectEvent) =>
            {
                if (!evt.object.resolvedAt)
                {
                    // We need to get the full ObjectProperties so we can be sure this is or isn't a rez from inventory
                    await this.queueResolveObject(evt.object, true);
                }
                if (evt.createSelected && !evt.object.claimedForBuild)
                {
                    if (evt.object.itemID === undefined || evt.object.itemID.equals(UUID.zero()))
                    {
                        if (
                            evt.object.PCode === PCode.Prim &&
                            evt.object.Material === 3 &&
                            evt.object.PathCurve === 16 &&
                            evt.object.ProfileCurve === 1 &&
                            evt.object.PathBegin === 0 &&
                            evt.object.PathEnd === 1 &&
                            evt.object.PathScaleX === 1 &&
                            evt.object.PathScaleY === 1 &&
                            evt.object.PathShearX === 0 &&
                            evt.object.PathShearY === 0 &&
                            evt.object.PathTwist === 0 &&
                            evt.object.PathTwistBegin === 0 &&
                            evt.object.PathRadiusOffset === 0 &&
                            evt.object.PathTaperX === 0 &&
                            evt.object.PathTaperY === 0 &&
                            evt.object.PathRevolutions === 1 &&
                            evt.object.PathSkew === 0 &&
                            evt.object.ProfileBegin === 0 &&
                            evt.object.ProfileHollow === 0
                        )
                        {
                            evt.object.claimedForBuild = true;
                            gatheredPrims.push(evt.object);
                            if (gatheredPrims.length === count)
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
                                resolve(gatheredPrims);
                            }
                        }
                    }
                }
            });

            for (let x = 0; x < count; x++)
            {
                const msg = new ObjectAddMessage();
                msg.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: this.circuit.sessionID,
                    GroupID: UUID.zero()
                };
                msg.ObjectData = {
                    PCode: PCode.Prim,
                    Material: 3,
                    AddFlags: PrimFlags.CreateSelected,
                    PathCurve: 16,
                    ProfileCurve: 1,
                    PathBegin: 0,
                    PathEnd: 0,
                    PathScaleX: 100,
                    PathScaleY: 100,
                    PathShearX: 0,
                    PathShearY: 0,
                    PathTwist: 0,
                    PathTwistBegin: 0,
                    PathRadiusOffset: 0,
                    PathTaperX: 0,
                    PathTaperY: 0,
                    PathRevolutions: 0,
                    PathSkew: 0,
                    ProfileBegin: 0,
                    ProfileEnd: 0,
                    ProfileHollow: 0,
                    BypassRaycast: 1,
                    RayStart: position,
                    RayEnd: position,
                    RayTargetID: UUID.zero(),
                    RayEndIsIntersection: 0,
                    Scale: new Vector3([0.5, 0.5, 0.5]),
                    Rotation: Quaternion.getIdentity(),
                    State: 0
                };
                this.circuit.sendMessage(msg, PacketFlags.Reliable);
            }
        });
    }

    rezFromInventory(obj: GameObject, position: Vector3, inventoryID: UUID): Promise<GameObject>
    {
        return new Promise(async (resolve, reject) =>
        {
            const invItem = this.agent.inventory.itemsByID[inventoryID.toString()];
            const queryID = UUID.random();
            const msg = new RezObjectMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID,
                GroupID: UUID.zero()
            };
            msg.RezData = {
                FromTaskID: UUID.zero(),
                BypassRaycast: 1,
                RayStart: position,
                RayEnd: position,
                RayTargetID: UUID.zero(),
                RayEndIsIntersection: false,
                RezSelected: true,
                RemoveItem: false,
                ItemFlags: invItem.flags,
                GroupMask: PermissionMask.All,
                EveryoneMask: PermissionMask.All,
                NextOwnerMask: PermissionMask.All,
            };
            msg.InventoryData = {
                ItemID: invItem.itemID,
                FolderID: invItem.parentID,
                CreatorID: invItem.permissions.creator,
                OwnerID: invItem.permissions.owner,
                GroupID: invItem.permissions.group,
                BaseMask: invItem.permissions.baseMask,
                OwnerMask: invItem.permissions.ownerMask,
                GroupMask: invItem.permissions.groupMask,
                EveryoneMask: invItem.permissions.everyoneMask,
                NextOwnerMask: invItem.permissions.nextOwnerMask,
                GroupOwned: false,
                TransactionID: queryID,
                Type: invItem.type,
                InvType: invItem.inventoryType,
                Flags: invItem.flags,
                SaleType: invItem.saleType,
                SalePrice: invItem.salePrice,
                Name: Utils.StringToBuffer(invItem.name),
                Description: Utils.StringToBuffer(invItem.description),
                CreationDate: Math.round(invItem.created.getTime() / 1000),
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
            objSub = this.currentRegion.clientEvents.onNewObjectEvent.subscribe(async (evt: NewObjectEvent) =>
            {
                if (evt.createSelected && !evt.object.resolvedAt)
                {
                    // We need to get the full ObjectProperties so we can be sure this is or isn't a rez from inventory
                    await this.queueResolveObject(evt.object, true);
                }
                if (evt.createSelected && !evt.object.claimedForBuild && !claimedPrim)
                {
                    if (inventoryID !== undefined && evt.object.itemID !== undefined && evt.object.itemID.equals(inventoryID))
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
            if (obj.Scale !== undefined)
            {
                const camLocation = new Vector3(position);
                camLocation.z += (obj.Scale.z / 2) + 1;
                await this.currentRegion.clientCommands.agent.setCamera(camLocation, position, obj.Scale.z, new Vector3([-1.0, 0, 0]), new Vector3([0.0, 1.0, 0]));
            }
            this.circuit.sendMessage(msg, PacketFlags.Reliable);
        });
    }

    async getObjectByLocalID(id: number, resolve: boolean, waitFor: number = 0)
    {
        let obj = null;
        try
        {
            obj = this.currentRegion.objects.getObjectByLocalID(id);
        }
        catch (error)
        {
            if (waitFor > 0)
            {
                obj = await this.waitForObjectByLocalID(id, waitFor);
            }
            else
            {
                throw(error);
            }
        }
        if (resolve)
        {
            await this.resolveObjects([obj]);
        }
        return obj;
    }

    async getObjectByUUID(id: UUID, resolve: boolean, waitFor: number = 0)
    {
        let obj = null;
        try
        {
            obj = this.currentRegion.objects.getObjectByUUID(id);
        }
        catch (error)
        {
            if (waitFor > 0)
            {
                obj = await this.waitForObjectByUUID(id, waitFor);
            }
            else
            {
                throw(error);
            }
        }
        if (resolve)
        {
            await this.resolveObjects([obj]);
        }
        return obj;
    }

    async findObjectsByName(pattern: string | RegExp, minX?: number, maxX?: number, minY?: number, maxY?: number, minZ?: number, maxZ?: number): Promise<GameObject[]>
    {
        let objects: GameObject[] = [];
        if (minX !== undefined && maxX !== undefined && minY !== undefined && maxY !== undefined && minZ !== undefined && maxZ !== undefined)
        {
            objects = await this.getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ, true);
        }
        else
        {
            objects = await this.getAllObjects(true);
        }
        const idCheck: {[key: string]: boolean} = {};
        const matches: GameObject[] = [];
        const it = function(go: GameObject)
        {
            if (go.name !== undefined)
            {
                let match = false;
                if (pattern instanceof RegExp)
                {
                    if (pattern.test(go.name))
                    {
                        match = true;
                    }
                }
                else
                {
                    match = micromatch.isMatch(go.name, pattern, {nocase: true});
                }

                if (match)
                {
                    const fullID = go.FullID.toString();
                    if (!idCheck[fullID])
                    {
                        matches.push(go);
                        idCheck[fullID] = true;
                    }
                }
            }
            if (go.children && go.children.length > 0)
            {
                for (const child of go.children)
                {
                    it(child);
                }
            }
        };
        for (const go of objects)
        {
            it(go);
        }
        return matches;
    }

    getParcelAt(x: number, y: number): Promise<Parcel>
    {
        return this.currentRegion.getParcelProperties(x, y);
    }

    getParcels(): Promise<Parcel[]>
    {
        return this.currentRegion.getParcels();
    }

    async getAllObjects(resolve: boolean = false, onlyUnresolved: boolean = false): Promise<GameObject[]>
    {
        const objs = await this.currentRegion.objects.getAllObjects();
        if (resolve)
        {
            await this.resolveObjects(objs, onlyUnresolved);
        }
        return objs;
    }

    async getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number, resolve: boolean = false): Promise<GameObject[]>
    {
        const objs = await this.currentRegion.objects.getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ);
        if (resolve)
        {
            await this.resolveObjects(objs);
        }
        return objs;
    }

    async pruneObjects(checkList: GameObject[]): Promise<GameObject[]>
    {
        let uuids = [];
        let objects = [];
        const stillAlive: {[key: string]: GameObject} = {};
        const checkObjects = async (uuidList: any[], objectList: GameObject[]) =>
        {

            const objRef: {[key: string]: GameObject} = {};
            for (const obj of objectList)
            {
                objRef[obj.FullID.toString()] = obj;
            }
            const result = await this.currentRegion.caps.capsPostXML('GetObjectCost', {
                'object_ids': uuidList
            });
            for (const u of Object.keys(result))
            {
                stillAlive[u] = objRef[u];
            }
        };

        for (const o of checkList)
        {
            if (o.FullID)
            {
                uuids.push(new LLSD.UUID(o.FullID));
                objects.push(o);
                if (uuids.length > 256)
                {
                    await checkObjects(uuids, objects);
                    uuids = [];
                    objects = [];
                }
            }
        }
        if (uuids.length > 0)
        {
            await checkObjects(uuids, objects);
        }
        const deadObjects: GameObject[] = [];
        for (const o of checkList)
        {
            let found = false;
            if (o.FullID)
            {
                const fullID = o.FullID.toString();
                if (stillAlive[fullID])
                {
                    found = true;
                }
            }
            if (!found)
            {
                deadObjects.push(o);
            }
        }
        return deadObjects;
    }

    setPersist(persist: boolean)
    {
        this.currentRegion.objects.setPersist(persist);
    }

    async grabObject(localID: number | UUID,
               grabOffset: Vector3 = Vector3.getZero(),
               uvCoordinate: Vector3 = Vector3.getZero(),
               stCoordinate: Vector3 = Vector3.getZero(),
               faceIndex: number = 0,
               position: Vector3 = Vector3.getZero(),
               normal: Vector3 = Vector3.getZero(),
               binormal: Vector3 = Vector3.getZero())
    {
        if (localID instanceof UUID)
        {
            const obj: GameObject = this.currentRegion.objects.getObjectByUUID(localID);
            localID = obj.ID;
        }
        const msg = new ObjectGrabMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.ObjectData = {
            LocalID: localID,
            GrabOffset: grabOffset
        };
        msg.SurfaceInfo = [
            {
                UVCoord: uvCoordinate,
                STCoord: stCoordinate,
                FaceIndex: faceIndex,
                Position: position,
                Normal: normal,
                Binormal: binormal
            }
        ];
        const seqID = this.circuit.sendMessage(msg, PacketFlags.Reliable);
        await this.circuit.waitForAck(seqID, 10000);
    }

    async deGrabObject(localID: number | UUID,
                     grabOffset: Vector3 = Vector3.getZero(),
                     uvCoordinate: Vector3 = Vector3.getZero(),
                     stCoordinate: Vector3 = Vector3.getZero(),
                     faceIndex: number = 0,
                     position: Vector3 = Vector3.getZero(),
                     normal: Vector3 = Vector3.getZero(),
                     binormal: Vector3 = Vector3.getZero())
    {
        if (localID instanceof UUID)
        {
            const obj: GameObject = this.currentRegion.objects.getObjectByUUID(localID);
            localID = obj.ID;
        }
        const msg = new ObjectDeGrabMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.ObjectData = {
            LocalID: localID
        };
        msg.SurfaceInfo = [
            {
                UVCoord: uvCoordinate,
                STCoord: stCoordinate,
                FaceIndex: faceIndex,
                Position: position,
                Normal: normal,
                Binormal: binormal
            }
        ];
        const seqID = this.circuit.sendMessage(msg, PacketFlags.Reliable);
        await this.circuit.waitForAck(seqID, 10000);
    }

    async dragGrabbedObject(localID: number | UUID,
                       grabPosition: Vector3,
                       grabOffset: Vector3 = Vector3.getZero(),
                       uvCoordinate: Vector3 = Vector3.getZero(),
                       stCoordinate: Vector3 = Vector3.getZero(),
                       faceIndex: number = 0,
                       position: Vector3 = Vector3.getZero(),
                       normal: Vector3 = Vector3.getZero(),
                       binormal: Vector3 = Vector3.getZero())
    {
        // For some reason this message takes a UUID when the others take a LocalID - wtf?
        if (!(localID instanceof UUID))
        {
            const obj: GameObject = this.currentRegion.objects.getObjectByLocalID(localID);
            localID = obj.FullID;
        }
        const msg = new ObjectGrabUpdateMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.ObjectData = {
            ObjectID: localID,
            GrabOffsetInitial: grabOffset,
            GrabPosition: grabPosition,
            TimeSinceLast: 0
        };
        msg.SurfaceInfo = [
            {
                UVCoord: uvCoordinate,
                STCoord: stCoordinate,
                FaceIndex: faceIndex,
                Position: position,
                Normal: normal,
                Binormal: binormal
            }
        ];
        const seqID = this.circuit.sendMessage(msg, PacketFlags.Reliable);
        await this.circuit.waitForAck(seqID, 10000);
    }

    async touchObject(localID: number | UUID,
                      grabOffset: Vector3 = Vector3.getZero(),
                      uvCoordinate: Vector3 = Vector3.getZero(),
                      stCoordinate: Vector3 = Vector3.getZero(),
                      faceIndex: number = 0,
                      position: Vector3 = Vector3.getZero(),
                      normal: Vector3 = Vector3.getZero(),
                      binormal: Vector3 = Vector3.getZero())
    {
        if (localID instanceof UUID)
        {
            const obj: GameObject = this.currentRegion.objects.getObjectByUUID(localID);
            localID = obj.ID;
        }
        await this.grabObject(localID, grabOffset, uvCoordinate, stCoordinate, faceIndex, position, normal, binormal);
        await this.deGrabObject(localID, grabOffset, uvCoordinate, stCoordinate, faceIndex, position, normal, binormal);
    }
}
