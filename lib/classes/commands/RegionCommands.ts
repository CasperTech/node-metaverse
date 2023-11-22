import * as LLSD from '@caspertech/llsd';

import * as Long from 'long';
import * as micromatch from 'micromatch';
import { Subscription } from 'rxjs';
import { SculptType } from '../../enums/SculptType';
import { FilterResponse } from '../../enums/FilterResponse';
import { InventoryType } from '../../enums/InventoryType';
import { Message } from '../../enums/Message';
import { PacketFlags } from '../../enums/PacketFlags';
import { PCode } from '../../enums/PCode';
import { PrimFlags } from '../../enums/PrimFlags';
import { NewObjectEvent } from '../../events/NewObjectEvent';
import { AssetMap } from '../AssetMap';
import { BuildMap } from '../BuildMap';
import { EstateOwnerMessageMessage } from '../messages/EstateOwnerMessage';
import { ObjectAddMessage } from '../messages/ObjectAdd';
import { ObjectDeGrabMessage } from '../messages/ObjectDeGrab';
import { ObjectDeselectMessage } from '../messages/ObjectDeselect';
import { ObjectGrabMessage } from '../messages/ObjectGrab';
import { ObjectGrabUpdateMessage } from '../messages/ObjectGrabUpdate';
import { ObjectPropertiesMessage } from '../messages/ObjectProperties';
import { ObjectSelectMessage } from '../messages/ObjectSelect';
import { RegionHandleRequestMessage } from '../messages/RegionHandleRequest';
import { RegionIDAndHandleReplyMessage } from '../messages/RegionIDAndHandleReply';
import { Avatar } from '../public/Avatar';
import { GameObject } from '../public/GameObject';
import { Parcel } from '../public/Parcel';
import { Quaternion } from '../Quaternion';
import { Utils } from '../Utils';
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { CommandsBase } from './CommandsBase';
import Timeout = NodeJS.Timeout;

import Timer = NodeJS.Timer;

export interface GetObjectsOptions
{
    resolve?: boolean;
    includeTempObjects?: boolean;
    includeAvatars?: boolean;
}

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

    estateMessage(method: string, params: string[]): Promise<void>
    {
        const msg = new EstateOwnerMessageMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID,
            TransactionID: UUID.zero()
        };
        msg.MethodData = {
            Invoice: UUID.random(),
            Method: Utils.StringToBuffer(method),
        }
        msg.ParamList = [];
        for (const param of params)
        {
            msg.ParamList.push({
                Parameter: Utils.StringToBuffer(param)
            })
        }
        const sequenceID = this.circuit.sendMessage(msg, PacketFlags.Reliable);
        return this.circuit.waitForAck(sequenceID, 10000);
    }

    restartRegion(secs: number): Promise<void>
    {
        return this.estateMessage('restart', [String(secs)]);
    }

    simulatorMessage(message: string): Promise<void>
    {
        return this.estateMessage('simulatormessage', [
            '-1',
            '-1',
            this.agent.agentID.toString(),
            this.agent.firstName + ' ' + this.agent.lastName,
            message
        ]);
    }

    cancelRestart(): Promise<void>
    {
        return this.restartRegion(-1);
    }

    getAvatarsInRegion(): Avatar[]
    {
        return Object.values(this.currentRegion.agents);
    }

    async deselectObjects(objects: GameObject[]): Promise<void>
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
                    if (x + y < objects.length)
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
            const uuidMap: { [key: string]: GameObject } = {};
            let skipped = 0;
            for (const obj of objects)
            {
                if (!(obj instanceof GameObject))
                {
                    skipped++;
                    continue;
                }
                const uuidStr = obj.FullID.toString();
                if (!uuidMap[uuidStr])
                {
                    uuidMap[uuidStr] = obj;
                    deselectObject.ObjectData.push({
                        ObjectLocalID: obj.ID
                    });
                }
            }
            if (skipped > 0)
            {
                console.log('Skipped ' + String(skipped) + ' bad objects during deselection');
            }

            const sequenceID = this.circuit.sendMessage(deselectObject, PacketFlags.Reliable);
            return this.circuit.waitForAck(sequenceID, 10000);
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

    async getTerrain(): Promise<Buffer>
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

    async selectObjects(objects: GameObject[]): Promise<void>
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
                    if (x + y < objects.length)
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
            const uuidMap: { [key: string]: GameObject } = {};
            let skipped = 0;
            for (const obj of objects)
            {
                if (!(obj instanceof GameObject))
                {
                    skipped++;
                    continue;
                }
                const uuidStr = obj.FullID.toString();
                if (!uuidMap[uuidStr])
                {
                    uuidMap[uuidStr] = obj;
                    selectObject.ObjectData.push({
                        ObjectLocalID: obj.ID
                    });
                }
            }
            if (skipped > 0)
            {
                console.log('Skipped ' + String(skipped) + ' bad objects during deselection');
            }

            // Create a map of our expected UUIDs
            this.circuit.sendMessage(selectObject, PacketFlags.Reliable);
            try
            {
                await this.circuit.waitForMessage<ObjectPropertiesMessage>(Message.ObjectProperties, 10000, (propertiesMessage: ObjectPropertiesMessage): FilterResponse =>
                {
                    let found = false;
                    for (const objData of propertiesMessage.ObjectData)
                    {
                        const objDataUUID = objData.ObjectID.toString();
                        if (uuidMap[objDataUUID] !== undefined)
                        {
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
                            obj.OwnerID = objData.OwnerID;
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
                    if (!(obj instanceof GameObject))
                    {
                        continue;
                    }
                    if (obj.resolvedAt === undefined || obj.name === undefined)
                    {
                        obj.resolveAttempts++;
                    }
                }
            }
        }
    }

    getName(): string
    {
        return this.currentRegion.regionName;
    }

    async resolveObject(object: GameObject, options: GetObjectsOptions): Promise<GameObject[]>
    {
        return this.currentRegion.resolver.resolveObjects([object], options);
    }

    async resolveObjects(objects: GameObject[], options: GetObjectsOptions): Promise<GameObject[]>
    {
        return this.currentRegion.resolver.resolveObjects(objects, options);
    }

    public async fetchObjectInventory(object: GameObject): Promise<void>
    {
        return this.currentRegion.resolver.getInventory(object);
    }

    public async fetchObjectInventories(objects: GameObject[]): Promise<void>
    {
        return this.currentRegion.resolver.getInventories(objects);
    }

    public async fetchObjectCost(object: GameObject): Promise<void>
    {
        return this.currentRegion.resolver.getCosts([object]);
    }

    public async fetchObjectCosts(objects: GameObject[]): Promise<void>
    {
        return this.currentRegion.resolver.getCosts(objects);
    }


    private waitForObjectByLocalID(localID: number, timeout: number): Promise<GameObject>
    {
        return new Promise<GameObject>((resolve, reject) =>
        {
            let tmr: Timer | null = null;
            const subscription = this.currentRegion.clientEvents.onNewObjectEvent.subscribe(async(event: NewObjectEvent) =>
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
            const subscription = this.currentRegion.clientEvents.onNewObjectEvent.subscribe(async(event: NewObjectEvent) =>
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

    private async buildPart(obj: GameObject, posOffset: Vector3, rotOffset: Quaternion, buildMap: BuildMap, markRoot = false): Promise<GameObject>
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
            const adjustedPos = new Vector3(objectPosition).multiplyByTSMQuat(new Quaternion(rotOffset));
            finalPos = new Vector3(new Vector3(posOffset).add(adjustedPos));

            const baseRot = new Quaternion(rotOffset);
            finalRot = new Quaternion(baseRot.multiply(new Quaternion(objectRotation)));
        }

        // Is this a mesh part?
        let object: GameObject | null = null;
        let rezzedMesh = false;
        if (obj.extraParams !== undefined && obj.extraParams.meshData !== null)
        {
            if (buildMap.assetMap.mesh[obj.extraParams.meshData.meshData.toString()] !== undefined)
            {
                const meshEntry = buildMap.assetMap.mesh[obj.extraParams.meshData.meshData.toString()];
                const rezLocation = new Vector3(buildMap.rezLocation);
                rezLocation.z += (objectScale.z / 2);

                if (meshEntry.item !== null)
                {
                    try
                    {
                        object = await meshEntry.item.rezInWorld(rezLocation);
                    }
                    catch (err)
                    {
                        console.error('Failed to rez object ' + obj.name + ' in-world');
                        console.error(err);
                    }
                    rezzedMesh = true;
                }
                else
                {
                    console.error('Unable to rez mesh item from inventory - item is null');
                }
            }
        }
        else if (buildMap.primReservoir.length > 0)
        {
            const newPrim = buildMap.primReservoir.shift();
            if (newPrim !== undefined)
            {
                object = newPrim;
                try
                {
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
                catch (err)
                {
                    console.error('Error setting shape on ' + obj.name);
                    console.error(err);
                }
            }
        }
        else
        {
            console.error('Exhausted prim reservoir!!');
        }

        if (object === null)
        {
            console.error('Failed to acquire prim for build');
            throw new Error('Failed to acquire prim for build');
        }

        if (markRoot)
        {
            object.isMarkedRoot = true;
        }

        try
        {
            await object.setGeometry(finalPos, finalRot, objectScale);
        }
        catch (err)
        {
            console.error('Error setting geometry on ' + obj.name);
            console.error(err);
        }

        if (obj.extraParams.sculptData !== null)
        {
            if (obj.extraParams.sculptData.type !== SculptType.Mesh)
            {
                const oldTextureID = obj.extraParams.sculptData.texture.toString();
                const item = buildMap.assetMap.textures[oldTextureID];
                if (item !== null && item !== undefined && item.item !== null)
                {
                    obj.extraParams.sculptData.texture = item.item.assetID;
                }
            }
        }

        if (rezzedMesh)
        {
            obj.extraParams.meshData = object.extraParams.meshData;
            obj.extraParams.sculptData = object.extraParams.sculptData;
        }

        try
        {
            await object.setExtraParams(obj.extraParams);
        }
        catch (err: unknown)
        {
            if (err instanceof Error)
            {
                throw (err);
            }
            else if (typeof err === 'string')
            {
                throw new Error(err);
            }
            else
            {
                throw new Error('Error setting ExtraParams on ' + obj.name);
            }
        }

        if (obj.TextureEntry !== undefined)
        {
            // Handle materials
            const materialUpload: {
                'FullMaterialsPerFace': any[]
            } = {
                'FullMaterialsPerFace': []
            };

            const materialFaces: { [key: string]: boolean } = {};
            if (obj.TextureEntry.defaultTexture !== undefined && obj.TextureEntry.defaultTexture !== null)
            {
                const materialID = obj.TextureEntry.defaultTexture.materialID;
                if (!materialID.isZero())
                {
                    const storedMat = buildMap.assetMap.materials[materialID.toString()];
                    if (storedMat !== null && storedMat !== undefined)
                    {
                        materialUpload.FullMaterialsPerFace.push({
                            ID: object.ID,
                            Material: storedMat.toLLSDObject()
                        });
                        materialFaces[-1] = true;
                    }
                }
            }

            for (let face = 0; face < obj.TextureEntry.faces.length; face++)
            {
                const materialID = obj.TextureEntry.faces[face].materialID;
                if (!materialID.isZero())
                {
                    const storedMat = buildMap.assetMap.materials[materialID.toString()];
                    if (storedMat !== null && storedMat !== undefined)
                    {
                        materialUpload.FullMaterialsPerFace.push({
                            Face: face,
                            ID: object.ID,
                            Material: storedMat.toLLSDObject()
                        });
                        materialFaces[face] = true;
                    }
                }
            }

            if (Object.keys(materialFaces).length > 0)
            {
                const zipped = await Utils.deflate(Buffer.from(LLSD.LLSD.formatBinary(materialUpload).octets));
                const newMat = {
                    'Zipped': new LLSD.Binary(Array.from(zipped), 'BASE64')
                };
                this.currentRegion.caps.capsPutXML('RenderMaterials', newMat).then(() =>
                {

                }).catch((err) =>
                {
                    console.error(err);
                });
                try
                {
                    let complete = false;
                    do
                    {
                        complete = true;
                        await object.waitForTextureUpdate(10000);
                        for (const materialFace of Object.keys(materialFaces))
                        {
                            const entry = object.TextureEntry;
                            if (entry === undefined)
                            {
                                complete = false;
                            }
                            else if (parseInt(materialFace, 10) === -1)
                            {
                                const def = entry.defaultTexture
                                if (def === undefined || def === null)
                                {
                                    complete = false;
                                }
                                else
                                {
                                    if (def.materialID.equals(UUID.zero()))
                                    {
                                        complete = false;
                                    }
                                }
                            }
                            else
                            {
                                const fc = parseInt(materialFace, 10);
                                const thisFace = entry.faces[fc];
                                if (thisFace === undefined)
                                {
                                    complete = false;
                                }
                                else
                                {
                                    if (thisFace.materialID.equals(UUID.zero()))
                                    {
                                        complete = false;
                                    }
                                }
                            }
                        }
                    }
                    while (!complete);
                }
                catch (error)
                {
                    console.error(obj.name + ':Timed out while waiting for RenderMaterials update');
                }
                if (object.TextureEntry !== undefined)
                {
                    for (let face = 0; face < object.TextureEntry.faces.length; face++)
                    {
                        const oldFace = obj.TextureEntry.faces[face];
                        if (!oldFace.materialID.isZero())
                        {
                            obj.TextureEntry.faces[face].materialID = object.TextureEntry.faces[face].materialID;
                            if (obj.TextureEntry.defaultTexture !== null)
                            {
                                if (oldFace.materialID.equals(obj.TextureEntry.defaultTexture.materialID))
                                {
                                    obj.TextureEntry.defaultTexture.materialID = obj.TextureEntry.faces[face].materialID;
                                }
                            }
                        }
                    }
                    if (obj.TextureEntry.defaultTexture !== null && object.TextureEntry.defaultTexture !== null)
                    {
                        obj.TextureEntry.defaultTexture.materialID = object.TextureEntry.defaultTexture.materialID;
                    }
                }
            }

            if (obj.TextureEntry.defaultTexture !== null)
            {
                const oldTextureID = obj.TextureEntry.defaultTexture.textureID.toString();

                const item = buildMap.assetMap.textures[oldTextureID];
                if (item !== null && item !== undefined && item.item !== null)
                {
                    obj.TextureEntry.defaultTexture.textureID = item.item.assetID;
                }
            }
            for (const j of obj.TextureEntry.faces)
            {
                const oldTextureID = j.textureID.toString();

                const item = buildMap.assetMap.textures[oldTextureID];
                if (item !== null && item !== undefined && item.item !== null)
                {
                    j.textureID = item.item.assetID;
                }
            }

            try
            {
                await object.setTextureEntry(obj.TextureEntry);
            }
            catch (error)
            {
                console.error('Error setting TextureEntry on ' + obj.name);
                console.error(error);
            }


        }

        if (obj.name !== undefined)
        {
            try
            {
                await object.setName(obj.name);
            }
            catch (error)
            {
                if (error instanceof Error)
                {
                    throw error;
                }
                else if (typeof error === 'string')
                {
                    throw new Error(error);
                }
                else
                {
                    throw new Error('Error setting name on ' + obj.name);
                }
            }
        }

        if (obj.description !== undefined)
        {
            try
            {
                await object.setDescription(obj.description);
            }
            catch (error)
            {
                if (error instanceof Error)
                {
                    throw error;
                }
                else if (typeof error === 'string')
                {
                    throw new Error(error);
                }
                else
                {
                    throw new Error('Error setting name on ' + obj.name);
                }
            }
        }

        for (const invItem of obj.inventory)
        {
            try
            {
                if (invItem.inventoryType === InventoryType.Object && invItem.assetID.isZero())
                {
                    invItem.assetID = invItem.itemID;
                }
                switch (invItem.inventoryType)
                {
                    case InventoryType.Clothing:
                    {
                        if (buildMap.assetMap.clothing[invItem.assetID.toString()] !== undefined)
                        {
                            const item = buildMap.assetMap.clothing[invItem.assetID.toString()].item;
                            if (item !== null)
                            {
                                await object.dropInventoryIntoContents(item);
                                await object.updateInventory();
                                for (const taskItem of object.inventory)
                                {
                                    if (taskItem.name === item.name)
                                    {
                                        taskItem.permissions = invItem.permissions;
                                        await taskItem.renameInTask(object, invItem.name);
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case InventoryType.Settings:
                    {
                        if (buildMap.assetMap.settings[invItem.assetID.toString()] !== undefined)
                        {
                            const item = buildMap.assetMap.settings[invItem.assetID.toString()].item;
                            if (item !== null)
                            {
                                await object.dropInventoryIntoContents(item);
                                await object.updateInventory();
                                for (const taskItem of object.inventory)
                                {
                                    if (taskItem.name === item.name)
                                    {
                                        taskItem.permissions = invItem.permissions;
                                        await taskItem.renameInTask(object, invItem.name);
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case InventoryType.Wearable:
                    case InventoryType.Bodypart:
                    {
                        if (buildMap.assetMap.bodyparts[invItem.assetID.toString()] !== undefined)
                        {
                            const item = buildMap.assetMap.bodyparts[invItem.assetID.toString()].item;
                            if (item !== null)
                            {
                                await object.dropInventoryIntoContents(item);
                                await object.updateInventory();
                                for (const taskItem of object.inventory)
                                {
                                    if (taskItem.name === item.name)
                                    {
                                        taskItem.permissions = invItem.permissions;
                                        await taskItem.renameInTask(object, invItem.name);
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case InventoryType.Notecard:
                    {
                        if (buildMap.assetMap.notecards[invItem.assetID.toString()] !== undefined)
                        {
                            const item = buildMap.assetMap.notecards[invItem.assetID.toString()].item;
                            if (item !== null)
                            {
                                await object.dropInventoryIntoContents(item);
                                await object.updateInventory();
                                for (const taskItem of object.inventory)
                                {
                                    if (taskItem.name === item.name)
                                    {
                                        taskItem.permissions = invItem.permissions;
                                        await taskItem.renameInTask(object, invItem.name);
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case InventoryType.Sound:
                    {
                        if (buildMap.assetMap.sounds[invItem.assetID.toString()] !== undefined)
                        {
                            const item = buildMap.assetMap.sounds[invItem.assetID.toString()].item;
                            if (item !== null)
                            {
                                await object.dropInventoryIntoContents(item);
                                await object.updateInventory();
                                for (const taskItem of object.inventory)
                                {
                                    if (taskItem.name === item.name)
                                    {
                                        taskItem.permissions = invItem.permissions;
                                        await taskItem.renameInTask(object, invItem.name);
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case InventoryType.Gesture:
                    {
                        if (buildMap.assetMap.gestures[invItem.assetID.toString()] !== undefined)
                        {
                            const item = buildMap.assetMap.gestures[invItem.assetID.toString()].item;
                            if (item !== null)
                            {
                                await object.dropInventoryIntoContents(item);
                                await object.updateInventory();
                                for (const taskItem of object.inventory)
                                {
                                    if (taskItem.name === item.name)
                                    {
                                        taskItem.permissions = invItem.permissions;
                                        await taskItem.renameInTask(object, invItem.name);
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case InventoryType.Script:
                    case InventoryType.LSL:
                    {
                        if (buildMap.assetMap.scripts[invItem.assetID.toString()] !== undefined)
                        {
                            const item = buildMap.assetMap.scripts[invItem.assetID.toString()].item;
                            if (item !== null)
                            {
                                await object.dropInventoryIntoContents(item);
                                await object.updateInventory();
                                for (const taskItem of object.inventory)
                                {
                                    if (taskItem.name === item.name)
                                    {
                                        taskItem.permissions = invItem.permissions;
                                        await taskItem.renameInTask(object, invItem.name);
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case InventoryType.Animation:
                    {
                        if (buildMap.assetMap.animations[invItem.assetID.toString()] !== undefined)
                        {
                            const item = buildMap.assetMap.animations[invItem.assetID.toString()].item;
                            if (item !== null)
                            {
                                await object.dropInventoryIntoContents(item);
                                await object.updateInventory();
                                for (const taskItem of object.inventory)
                                {
                                    if (taskItem.name === item.name)
                                    {
                                        taskItem.permissions = invItem.permissions;
                                        await taskItem.renameInTask(object, invItem.name);
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case InventoryType.Object:
                    {
                        if (buildMap.assetMap.objects[invItem.itemID.toString()] !== undefined)
                        {
                            const inventoryItem = buildMap.assetMap.objects[invItem.itemID.toString()];
                            if (inventoryItem !== null)
                            {
                                await object.dropInventoryIntoContents(inventoryItem);
                                await object.updateInventory();
                                for (const taskItem of object.inventory)
                                {
                                    if (taskItem.name === inventoryItem.name)
                                    {
                                        taskItem.permissions = invItem.permissions;
                                        await taskItem.renameInTask(object, invItem.name);
                                    }
                                }
                            }
                            else
                            {
                                console.error('Unable to drop object: item is null');
                            }
                        }
                        break;
                    }
                    case InventoryType.Texture:
                    case InventoryType.Snapshot:
                    {
                        if (buildMap.assetMap.textures[invItem.assetID.toString()] !== undefined)
                        {
                            const texItem = buildMap.assetMap.textures[invItem.assetID.toString()];
                            if (texItem.item !== null)
                            {
                                await object.dropInventoryIntoContents(texItem.item);
                                await object.updateInventory();
                                for (const taskItem of object.inventory)
                                {
                                    if (taskItem.name === texItem.item.name)
                                    {
                                        taskItem.permissions = invItem.permissions;
                                        await taskItem.renameInTask(object, invItem.name);
                                    }
                                }
                            }
                            else
                            {
                                console.error('Unable to drop object: item is null');
                            }
                        }
                        break;
                    }
                    default: // TODO: 3 - landmark
                        console.error('Unsupported inventory type: ' + invItem.inventoryType);
                        break;
                }
            }
            catch (error)
            {
                console.error(error);
            }
        }
        return object;
    }

    private gatherAssets(obj: GameObject, buildMap: BuildMap): void
    {
        if (obj.extraParams !== undefined)
        {
            if (obj.extraParams.meshData !== null)
            {
                if (buildMap.assetMap.mesh[obj.extraParams.meshData.meshData.toString()] === undefined)
                {
                    buildMap.assetMap.mesh[obj.extraParams.meshData.meshData.toString()] = {
                        name: obj.name || 'Object',
                        description: obj.description || '(no description)',
                        item: null
                    };
                }
            }
            else
            {
                buildMap.primsNeeded++;
            }
            if (obj.extraParams.sculptData !== null)
            {
                if (obj.extraParams.sculptData.type !== SculptType.Mesh)
                {
                    if (buildMap.assetMap.textures[obj.extraParams.sculptData.texture.toString()] === undefined)
                    {
                        buildMap.assetMap.textures[obj.extraParams.sculptData.texture.toString()] = {
                            item: null
                        };
                    }
                }
            }
            if (obj.TextureEntry !== undefined)
            {
                for (const j of obj.TextureEntry.faces)
                {
                    const textureID = j.textureID;
                    if (buildMap.assetMap.textures[textureID.toString()] === undefined)
                    {
                        buildMap.assetMap.textures[textureID.toString()] = {
                            item: null
                        }
                    }
                    const materialID = j.materialID;
                    if (!materialID.isZero())
                    {
                        if (buildMap.assetMap.materials[materialID.toString()] === undefined)
                        {
                            buildMap.assetMap.materials[materialID.toString()] = null
                        }
                    }
                }
                if (obj.TextureEntry.defaultTexture !== null)
                {
                    const textureID = obj.TextureEntry.defaultTexture.textureID;
                    if (buildMap.assetMap.textures[textureID.toString()] === undefined)
                    {
                        buildMap.assetMap.textures[textureID.toString()] = {
                            item: null
                        }
                    }
                    const materialID = obj.TextureEntry.defaultTexture.materialID;
                    if (!materialID.isZero())
                    {
                        if (buildMap.assetMap.materials[materialID.toString()] === undefined)
                        {
                            buildMap.assetMap.materials[materialID.toString()] = null
                        }
                    }
                }
            }
            if (obj.inventory !== undefined)
            {
                for (const j of obj.inventory)
                {
                    const assetID = j.assetID;
                    switch (j.inventoryType)
                    {
                        case InventoryType.Animation:
                        {
                            if (buildMap.assetMap.animations[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.animations[assetID.toString()] = {
                                    name: j.name,
                                    description: j.description,
                                    item: null
                                };
                            }
                            break;
                        }
                        case InventoryType.Wearable:
                        case InventoryType.Bodypart:
                        {
                            if (buildMap.assetMap.bodyparts[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.bodyparts[assetID.toString()] = {
                                    name: j.name,
                                    description: j.description,
                                    item: null
                                };
                            }
                            break;
                        }
                        case InventoryType.CallingCard:
                        {
                            if (buildMap.assetMap.callingcards[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.callingcards[assetID.toString()] = {
                                    name: j.name,
                                    description: j.description,
                                    item: null
                                };
                            }
                            break;
                        }
                        case InventoryType.Clothing:
                        {
                            if (buildMap.assetMap.clothing[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.clothing[assetID.toString()] = {
                                    name: j.name,
                                    description: j.description,
                                    item: null
                                };
                            }
                            break;
                        }
                        case InventoryType.Gesture:
                        {
                            if (buildMap.assetMap.gestures[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.gestures[assetID.toString()] = {
                                    name: j.name,
                                    description: j.description,
                                    item: null
                                };
                            }
                            break;
                        }
                        case InventoryType.Script:
                        case InventoryType.LSL:
                        {
                            if (buildMap.assetMap.scripts[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.scripts[assetID.toString()] = {
                                    name: j.name,
                                    description: j.description,
                                    item: null
                                };
                            }
                            break;
                        }
                        case InventoryType.Texture:
                        case InventoryType.Snapshot:
                        {
                            if (buildMap.assetMap.textures[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.textures[assetID.toString()] = {
                                    name: j.name,
                                    description: j.description,
                                    item: null
                                };
                            }
                            break;
                        }
                        case InventoryType.Notecard:
                        {
                            if (buildMap.assetMap.notecards[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.notecards[assetID.toString()] = {
                                    name: j.name,
                                    description: j.description,
                                    item: null
                                };
                            }
                            break;
                        }
                        case InventoryType.Sound:
                        {
                            if (buildMap.assetMap.sounds[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.sounds[assetID.toString()] = {
                                    name: j.name,
                                    description: j.description,
                                    item: null
                                };
                            }
                            break;
                        }
                        case InventoryType.Object:
                        {
                            if (buildMap.assetMap.objects[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.objects[assetID.toString()] = null;
                            }
                            break;
                        }
                        case InventoryType.Settings:
                        {
                            if (buildMap.assetMap.settings[assetID.toString()] === undefined)
                            {
                                buildMap.assetMap.settings[assetID.toString()] = {
                                    name: j.name,
                                    description: j.description,
                                    item: null
                                };
                            }
                            break;
                        }
                        default:
                            console.error('Unsupported inventory type: ' + j.inventoryType);
                            break;
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

    async buildObjectNew(obj: GameObject, map: AssetMap, callback: (map: AssetMap) => void, costOnly: boolean = false, skipMove = false): Promise<GameObject | null>
    {
        const  buildMap = new BuildMap(map, callback, costOnly);
        this.gatherAssets(obj, buildMap);
        const bomTextures = [
            '5a9f4a74-30f2-821c-b88d-70499d3e7183',
            'ae2de45c-d252-50b8-5c6e-19f39ce79317',
            '24daea5f-0539-cfcf-047f-fbc40b2786ba',
            '52cc6bb6-2ee5-e632-d3ad-50197b1dcb8a',
            '43529ce8-7faa-ad92-165a-bc4078371687',
            '09aac1fb-6bce-0bee-7d44-caac6dbb6c63',
            'ff62763f-d60a-9855-890b-0c96f8f8cd98',
            '8e915e25-31d1-cc95-ae08-d58a47488251',
            '9742065b-19b5-297c-858a-29711d539043',
            '03642e83-2bd1-4eb9-34b4-4c47ed586d2d',
            'edd51b77-fc10-ce7a-4b3d-011dfc349e4f',
            'c228d1cf-4b5d-4ba8-84f4-899a0796aa97' // 'non existent asset'
        ];
        for (const bomTexture of bomTextures)
        {
            if (buildMap.assetMap.textures[bomTexture] !== undefined)
            {
                delete buildMap.assetMap.textures[bomTexture];
            }
        }
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

        let storedPosition: Vector3 | undefined = undefined;
        if (skipMove)
        {
            storedPosition = obj.Position;
            obj.Position = new Vector3(buildMap.rezLocation);
        }

        const parts = [];
        parts.push(async() =>
        {
            return {
                index: 1,
                object: await this.buildPart(obj, Vector3.getZero(), Quaternion.getIdentity(), buildMap, true)
            }
        });

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
            let childIndex = 2;
            for (const child of obj.children)
            {
                if (child.Position !== undefined && child.Rotation !== undefined)
                {
                    const index = childIndex++;
                    parts.push(async() =>
                    {
                        return {
                            index,
                            object: await this.buildPart(child, new Vector3(obj.Position), new Quaternion(obj.Rotation), buildMap, false)
                        }
                    });
                }
            }
        }
        let results: {
            results: {
               index: number,
               object: GameObject
            }[],
            errors: Error[]
        } = {
            results: [],
            errors: []
        };
        results = await Utils.promiseConcurrent<{
            index: number,
            object: GameObject
        }>(parts, 5, 0);
        if (results.errors.length > 0)
        {
            for (const err of results.errors)
            {
                console.error(err);
            }
        }

        let rootObj: GameObject | null = null;
        for (const childObject of results.results)
        {
            if (childObject.object.isMarkedRoot)
            {
                rootObj = childObject.object;
                break;
            }
        }
        if (rootObj === null)
        {
            throw new Error('Failed to find root prim..');
        }

        const childPrims: GameObject[] = [];
        results.results.sort((a: { index: number, object: GameObject }, b: { index: number, object: GameObject }) =>
        {
            return a.index - b.index;
        });
        for (const childObject of results.results)
        {
            if (childObject.object !== rootObj)
            {
                childPrims.push(childObject.object);
            }
        }
        try
        {
            await rootObj.linkFrom(childPrims);
        }
        catch (err)
        {
            console.error('Link failed:');
            console.error(err);
        }
        if (storedPosition !== undefined)
        {
            obj.Position = storedPosition;
        }
        return rootObj;
    }

    private createPrims(count: number, position: Vector3): Promise<GameObject[]>
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
            objSub = this.currentRegion.clientEvents.onNewObjectEvent.subscribe(async(evt: NewObjectEvent) =>
            {
                if (!evt.object.resolvedAt)
                {
                    // We need to get the full ObjectProperties so we can be sure this is or isn't a rez from inventory
                    await this.resolveObject(evt.object, {});
                }
                if (evt.createSelected && !evt.object.claimedForBuild)
                {
                    if (evt.object.itemID === undefined || evt.object.itemID.isZero())
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

    async getObjectByLocalID(id: number, resolve: boolean, waitFor: number = 0): Promise<GameObject>
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
                throw (error);
            }
        }
        if (resolve)
        {
            await this.currentRegion.resolver.resolveObjects([obj], {});
        }
        return obj;
    }

    async getObjectByUUID(id: UUID, resolve: boolean, waitFor: number = 0): Promise<GameObject>
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
                throw (error);
            }
        }
        if (resolve)
        {
            await this.currentRegion.resolver.resolveObjects([obj], {});
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
            objects = await this.getAllObjects({  resolve: true  });
        }
        const idCheck: { [key: string]: boolean } = {};
        const matches: GameObject[] = [];
        const it = function(go: GameObject): void
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
                    match = micromatch.isMatch(go.name, pattern, { nocase: true });
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

    async getAllObjects(options: GetObjectsOptions): Promise<GameObject[]>
    {
        const objs = await this.currentRegion.objects.getAllObjects();
        if (options.resolve)
        {
            await this.currentRegion.resolver.resolveObjects(objs, options);
        }
        return objs;
    }

    async getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number, resolve: boolean = false): Promise<GameObject[]>
    {
        const objs = await this.currentRegion.objects.getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ);
        if (resolve)
        {
            await this.currentRegion.resolver.resolveObjects(objs, {});
        }
        return objs;
    }

    async pruneObjects(checkList: GameObject[]): Promise<GameObject[]>
    {
        let uuids = [];
        let objects = [];
        const stillAlive: { [key: string]: GameObject } = {};
        const checkObjects = async(uuidList: any[], objectList: GameObject[]) =>
        {

            const objRef: { [key: string]: GameObject } = {};
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

    setPersist(persist: boolean): void
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
               binormal: Vector3 = Vector3.getZero()): Promise<void>
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
        return this.circuit.waitForAck(seqID, 10000);
    }

    async deGrabObject(localID: number | UUID,
                     _grabOffset: Vector3 = Vector3.getZero(),
                     uvCoordinate: Vector3 = Vector3.getZero(),
                     stCoordinate: Vector3 = Vector3.getZero(),
                     faceIndex: number = 0,
                     position: Vector3 = Vector3.getZero(),
                     normal: Vector3 = Vector3.getZero(),
                     binormal: Vector3 = Vector3.getZero()): Promise<void>
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
        return this.circuit.waitForAck(seqID, 10000);
    }

    async dragGrabbedObject(localID: number | UUID,
                       grabPosition: Vector3,
                       grabOffset: Vector3 = Vector3.getZero(),
                       uvCoordinate: Vector3 = Vector3.getZero(),
                       stCoordinate: Vector3 = Vector3.getZero(),
                       faceIndex: number = 0,
                       position: Vector3 = Vector3.getZero(),
                       normal: Vector3 = Vector3.getZero(),
                       binormal: Vector3 = Vector3.getZero()): Promise<void>
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
        return this.circuit.waitForAck(seqID, 10000);
    }

    async touchObject(localID: number | UUID,
                      grabOffset: Vector3 = Vector3.getZero(),
                      uvCoordinate: Vector3 = Vector3.getZero(),
                      stCoordinate: Vector3 = Vector3.getZero(),
                      faceIndex: number = 0,
                      position: Vector3 = Vector3.getZero(),
                      normal: Vector3 = Vector3.getZero(),
                      binormal: Vector3 = Vector3.getZero()): Promise<void>
    {
        if (localID instanceof UUID)
        {
            const obj: GameObject = this.currentRegion.objects.getObjectByUUID(localID);
            localID = obj.ID;
        }
        await this.grabObject(localID, grabOffset, uvCoordinate, stCoordinate, faceIndex, position, normal, binormal);
        return this.deGrabObject(localID, grabOffset, uvCoordinate, stCoordinate, faceIndex, position, normal, binormal);
    }
}
