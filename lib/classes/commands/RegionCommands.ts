import {CommandsBase} from './CommandsBase';
import {UUID} from '../UUID';
import * as Long from 'long';
import {RegionHandleRequestMessage} from '../messages/RegionHandleRequest';
import {Message} from '../../enums/Message';
import {FilterResponse} from '../../enums/FilterResponse';
import {RegionIDAndHandleReplyMessage} from '../messages/RegionIDAndHandleReply';
import {AssetType, PacketFlags, PCode, Vector3} from '../..';
import {ObjectGrabMessage} from '../messages/ObjectGrab';
import {ObjectDeGrabMessage} from '../messages/ObjectDeGrab';
import {ObjectGrabUpdateMessage} from '../messages/ObjectGrabUpdate';
import {GameObject} from '../public/GameObject';
import {ObjectSelectMessage} from '../messages/ObjectSelect';
import {ObjectPropertiesMessage} from '../messages/ObjectProperties';
import {Utils} from '../Utils';
import {ObjectDeselectMessage} from '../messages/ObjectDeselect';
import * as micromatch from 'micromatch';
import * as LLSD from '@caspertech/llsd';
import {PrimFlags} from '../../enums/PrimFlags';
import {Parcel} from '../public/Parcel';
import {ParcelPropertiesRequestMessage} from '../messages/ParcelPropertiesRequest';
import {RequestTaskInventoryMessage} from '../messages/RequestTaskInventory';
import {ReplyTaskInventoryMessage} from '../messages/ReplyTaskInventory';
import {InventoryItem} from '../InventoryItem';
import {AssetTypeLL} from '../../enums/AssetTypeLL';
import {SaleTypeLL} from '../../enums/SaleTypeLL';
import {InventoryTypeLL} from '../../enums/InventoryTypeLL';
import Timer = NodeJS.Timer;
import {NewObjectEvent} from '../../events/NewObjectEvent';

export class RegionCommands extends CommandsBase
{
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

                            // console.log(obj.name + ' (' + resolved + ' of ' + objects.length + ')');
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

    private async resolveObjects(objects: GameObject[], onlyUnresolved: boolean = false)
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
                if (objs[ky] !== undefined)
                {
                    const o = objs[ky];
                    if (o.FullID !== undefined && o.name !== undefined && o.Flags !== undefined && !(o.Flags & PrimFlags.InventoryEmpty) && (!o.inventory || o.inventory.length === 0))
                    {
                        console.log(' ... Downloading task inventory for object ' + o.FullID.toString() + ' (' + o.name + '), done ' + count + ' of ' + objectSet.length);
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
                const result = await that.currentRegion.caps.capsRequestXML('GetObjectCost', {
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
            tmr = setTimeout(() => {
                subscription.unsubscribe();
                reject(new Error('Timeout'));
            }, timeout)
        });
    }

    private waitForObjectByUUID(uuid: UUID, timeout: number): Promise<GameObject>
    {
        return new Promise<GameObject>((resolve, reject) =>
        {
            let tmr: Timer | null = null;
            const subscription = this.currentRegion.clientEvents.onNewObjectEvent.subscribe(async (event: NewObjectEvent) =>
            {
                if (event.objectID.equals(uuid))
                {
                    if (tmr !== null)
                    {
                        clearTimeout(tmr);
                    }
                    subscription.unsubscribe();
                    resolve(event.object);
                }
            });
            tmr = setTimeout(() => {
                subscription.unsubscribe();
                reject(new Error('Timeout'));
            }, timeout)
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
                    const uuid = go.FullID.toString();
                    if (!idCheck[uuid])
                    {
                        matches.push(go);
                        idCheck[uuid] = true;
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

    async getParcels(): Promise<Parcel[]>
    {
        this.currentRegion.resetParcels();
        for (let y = 0; y < 64; y++)
        {
            for (let x = 0; x < 64; x++)
            {
                if (this.currentRegion.parcelMap[y][x] === 0)
                {
                    const request = new ParcelPropertiesRequestMessage();
                    request.AgentData = {
                        AgentID: this.agent.agentID,
                        SessionID: this.circuit.sessionID
                    };
                    request.ParcelData = {
                        North: (y + 1) * 4.0,
                        East: (x + 1) * 4.0,
                        South: y * 4.0,
                        West: x * 4.0,
                        SequenceID: 2147483647,
                        SnapSelection: false
                    };
                    const seqNo = this.circuit.sendMessage(request, PacketFlags.Reliable);
                    await this.circuit.waitForAck(seqNo, 10000);
                    // Wait a second until we request the next one
                    await function()
                    {
                        return new Promise<void>((resolve, reject) =>
                        {
                            setTimeout(() =>
                            {
                                resolve();
                            }, 1000);
                        })
                    }();
                }
            }
        }
        await this.currentRegion.waitForParcels();
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
            const result = await this.currentRegion.caps.capsRequestXML('GetObjectCost', {
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
        console.log('Found ' + Object.keys(stillAlive).length + ' objects still present out of ' + checkList.length + ' objects');
        const deadObjects: GameObject[] = [];
        for (const o of checkList)
        {
            let found = false;
            if (o.FullID)
            {
                const uuid = o.FullID.toString();
                if (stillAlive[uuid])
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
