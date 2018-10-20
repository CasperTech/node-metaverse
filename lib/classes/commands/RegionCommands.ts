import {CommandsBase} from './CommandsBase';
import {UUID} from '../UUID';
import * as Long from 'long';
import {RegionHandleRequestMessage} from '../messages/RegionHandleRequest';
import {Message} from '../../enums/Message';
import {FilterResponse} from '../../enums/FilterResponse';
import {RegionIDAndHandleReplyMessage} from '../messages/RegionIDAndHandleReply';
import {PacketFlags, PCode, Vector3} from '../..';
import {ObjectGrabMessage} from '../messages/ObjectGrab';
import {ObjectDeGrabMessage} from '../messages/ObjectDeGrab';
import {ObjectGrabUpdateMessage} from '../messages/ObjectGrabUpdate';
import {GameObject} from '../GameObject';
import {ObjectSelectMessage} from '../messages/ObjectSelect';
import {ObjectPropertiesMessage} from '../messages/ObjectProperties';
import {Utils} from '../Utils';
import {ObjectDeselectMessage} from '../messages/ObjectDeselect';
import * as micromatch from 'micromatch';
import * as LLSD from "@caspertech/llsd";

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
            return await this.circuit.waitForMessage<ObjectPropertiesMessage>(Message.ObjectProperties, 10000, (propertiesMessage: ObjectPropertiesMessage): FilterResponse =>
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
    }

    private async resolveObjects(objects: GameObject[])
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
                    if (o.resolvedAt !== undefined && o.resolvedAt < resolveTime && o.PCode !== PCode.Avatar)
                    {
                        objs[ky].name = undefined;
                        totalRemaining++;
                        objectList.push(objs[ky]);
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
        }
        catch (ignore)
        {

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
                    const obj: GameObject = that.currentRegion.objects.getObjectByUUID(new UUID(key));
                    obj.linkPhysicsImpact = parseFloat(costs['linked_set_physics_cost']);
                    obj.linkResourceImpact = parseFloat(costs['linked_set_resource_cost']);
                    obj.physicaImpact = parseFloat(costs['physics_cost']);
                    obj.resourceImpact = parseFloat(costs['resource_cost']);

                    obj.landImpact = Math.ceil(obj.linkPhysicsImpact);
                    if (obj.linkResourceImpact > obj.linkPhysicsImpact)
                    {
                        obj.landImpact = Math.ceil(obj.linkResourceImpact);
                    }
                }
            };

            let ids: UUID[] = [];
            const promises: Promise<void>[] = [];
            for (const obj of objects)
            {
                ids.push(new LLSD.UUID(obj.FullID));
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

    async getAllObjects(resolve: boolean = false): Promise<GameObject[]>
    {
        const objs = this.currentRegion.objects.getAllObjects();
        if (resolve)
        {
            await this.resolveObjects(objs);
        }
        return objs;
    }

    async getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number, resolve: boolean = false): Promise<GameObject[]>
    {
        const objs = this.currentRegion.objects.getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ);
        if (resolve)
        {
            await this.resolveObjects(objs);
        }
        return objs;
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
