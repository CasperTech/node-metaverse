import { Circuit } from './Circuit';
import { Logger } from './Logger';
import { Packet } from './Packet';
import { Message } from '../enums/Message';
import { ObjectUpdateMessage } from './messages/ObjectUpdate';
import { ObjectUpdateCachedMessage } from './messages/ObjectUpdateCached';
import { ObjectUpdateCompressedMessage } from './messages/ObjectUpdateCompressed';
import { ImprovedTerseObjectUpdateMessage } from './messages/ImprovedTerseObjectUpdate';
import { RequestMultipleObjectsMessage } from './messages/RequestMultipleObjects';
import { Agent } from './Agent';
import { UUID } from './UUID';
import { Utils } from './Utils';
import { ClientEvents } from './ClientEvents';
import { KillObjectMessage } from './messages/KillObject';
import { IObjectStore } from './interfaces/IObjectStore';
import { NameValue } from './NameValue';
import { GameObject } from './public/GameObject';
import { RBush3D } from 'rbush-3d/dist';
import { ITreeBoundingBox } from './interfaces/ITreeBoundingBox';
import { FilterResponse } from '../enums/FilterResponse';
import { ObjectSelectMessage } from './messages/ObjectSelect';
import { ObjectDeselectMessage } from './messages/ObjectDeselect';
import { Quaternion } from './Quaternion';
import { Subscription } from 'rxjs';
import { ExtraParams } from './public/ExtraParams';
import { ObjectPropertiesMessage } from './messages/ObjectProperties';
import { SelectedObjectEvent } from '../events/SelectedObjectEvent';
import { PrimFlags } from '../enums/PrimFlags';
import { PacketFlags } from '../enums/PacketFlags';
import { PCode } from '../enums/PCode';
import { BotOptionFlags } from '../enums/BotOptionFlags';
import { NewObjectEvent } from '../events/NewObjectEvent';
import { ObjectUpdatedEvent } from '../events/ObjectUpdatedEvent';
import { CompressedFlags } from '../enums/CompressedFlags';
import { Vector3 } from './Vector3';
import { ObjectPhysicsDataEvent } from '../events/ObjectPhysicsDataEvent';
import { ObjectResolvedEvent } from '../events/ObjectResolvedEvent';
import { Avatar } from './public/Avatar';

import Timer = NodeJS.Timer;

export class ObjectStoreLite implements IObjectStore
{
    protected circuit?: Circuit;
    protected agent: Agent;
    protected objects: { [key: number]: GameObject } = {};
    protected objectsByUUID: { [key: string]: number } = {};
    protected objectsByParent: { [key: number]: number[] } = {};
    protected clientEvents: ClientEvents;
    protected options: BotOptionFlags;
    protected requestedObjects: { [key: number]: boolean } = {};
    protected deadObjects: number[] = [];
    protected persist = false;
    protected pendingObjectProperties: { [key: string]: any } = {};
    private physicsSubscription: Subscription;
    private selectedPrimsWithoutUpdate: { [key: number]: boolean } = {};
    private selectedChecker?: Timer;

    rtree?: RBush3D;

    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags)
    {
        agent.localID = 0;
        this.options = options;
        this.clientEvents = clientEvents;
        this.circuit = circuit;
        this.agent = agent;
        this.circuit.subscribeToMessages([
            Message.ObjectUpdate,
            Message.ObjectUpdateCached,
            Message.ObjectUpdateCompressed,
            Message.ImprovedTerseObjectUpdate,
            Message.ObjectProperties,
            Message.KillObject
        ], async(packet: Packet) =>
        {
            switch (packet.message.id)
            {
                case Message.ObjectProperties:
                {
                    const objProp = packet.message as ObjectPropertiesMessage;
                    for (const obj of objProp.ObjectData)
                    {
                        const obje = this.objectsByUUID[obj.ObjectID.toString()];
                        if (obje !== undefined && this.objects[obje] !== undefined)
                        {
                            const o = this.objects[obje];
                            this.applyObjectProperties(o, obj);
                        }
                        else
                        {
                            this.pendingObjectProperties[obj.ObjectID.toString()] = obj;
                        }
                    }
                    break;
                }
                case Message.ObjectUpdate:
                {
                    const objectUpdate = packet.message as ObjectUpdateMessage;
                    this.objectUpdate(objectUpdate);
                    break;
                }
                case Message.ObjectUpdateCached:
                {
                    const objectUpdateCached = packet.message as ObjectUpdateCachedMessage;
                    this.objectUpdateCached(objectUpdateCached);
                    break;
                }
                case Message.ObjectUpdateCompressed:
                {
                    const objectUpdateCompressed = packet.message as ObjectUpdateCompressedMessage;
                    await this.objectUpdateCompressed(objectUpdateCompressed);
                    break;
                }
                case Message.ImprovedTerseObjectUpdate:
                {
                    const objectUpdateTerse = packet.message as ImprovedTerseObjectUpdateMessage;
                    this.objectUpdateTerse(objectUpdateTerse);
                    break;
                }
                case Message.KillObject:
                {
                    const killObj = packet.message as KillObjectMessage;
                    this.killObject(killObj);
                    break;
                }
            }
        });

        this.physicsSubscription = this.clientEvents.onPhysicsDataEvent.subscribe((evt: ObjectPhysicsDataEvent) =>
        {
            if (this.objects[evt.localID])
            {
                this.objects[evt.localID].physicsShapeType = evt.physicsShapeType;
                this.objects[evt.localID].density = evt.density;
                this.objects[evt.localID].restitution = evt.restitution;
                this.objects[evt.localID].gravityMultiplier = evt.gravityMultiplier;
                this.objects[evt.localID].friction = evt.friction;
            }
        });

        this.selectedChecker = setInterval(() =>
        {
            if (this.circuit === undefined)
            {
                return;
            }
            try
            {
                let selectObjects = [];
                for (const key of Object.keys(this.selectedPrimsWithoutUpdate))
                {
                    selectObjects.push(key);
                }

                function shuffle(a: string[]): string[]
                {
                    let j, x, i;
                    for (i = a.length - 1; i > 0; i--)
                    {
                        j = Math.floor(Math.random() * (i + 1));
                        x = a[i];
                        a[i] = a[j];
                        a[j] = x;
                    }
                    return a;
                }

                selectObjects = shuffle(selectObjects);
                if (selectObjects.length > 10)
                {
                    selectObjects = selectObjects.slice(0, 20);
                }
                if (selectObjects.length > 0)
                {
                    const selectObject = new ObjectSelectMessage();
                    selectObject.AgentData = {
                        AgentID: this.agent.agentID,
                        SessionID: this.circuit.sessionID
                    };
                    selectObject.ObjectData = [];
                    for (const id of selectObjects)
                    {
                        selectObject.ObjectData.push({
                            ObjectLocalID: parseInt(id, 10)
                        });
                    }
                    this.circuit.sendMessage(selectObject, PacketFlags.Reliable);
                }
            }
            catch (e: unknown)
            {
                Logger.Error(e);
            }
        }, 1000)
    }

    private applyObjectProperties(o: GameObject, obj: any): void
    {
        if (this.selectedPrimsWithoutUpdate[o.ID])
        {
            delete this.selectedPrimsWithoutUpdate[o.ID];
        }
        // const n = Utils.BufferToStringSimple(obj.Name); // Currently unused
        o.creatorID = obj.CreatorID;
        o.creationDate = obj.CreationDate;
        o.baseMask = obj.BaseMask;
        o.ownerMask = obj.OwnerMask;
        o.groupMask = obj.GroupMask;
        o.everyoneMask = obj.EveryoneMask;
        o.nextOwnerMask = obj.NextOwnerMask;
        o.ownershipCost = obj.OwnershipCost;
        o.saleType = obj.SaleType;
        o.salePrice = obj.SalePrice;
        o.aggregatePerms = obj.AggregatePerms;
        o.aggregatePermTextures = obj.AggregatePermTextures;
        o.aggregatePermTexturesOwner = obj.AggregatePermTexturesOwner;
        o.category = obj.Category;
        o.inventorySerial = obj.InventorySerial;
        o.itemID = obj.ItemID;
        o.folderID = obj.FolderID;
        o.fromTaskID = obj.FromTaskID;
        o.groupID = obj.GroupID;
        o.lastOwnerID = obj.LastOwnerID;
        o.name = Utils.BufferToStringSimple(obj.Name);
        o.description = Utils.BufferToStringSimple(obj.Description);
        o.touchName = Utils.BufferToStringSimple(obj.TouchName);
        o.sitName = Utils.BufferToStringSimple(obj.SitName);
        o.textureID = Utils.BufferToStringSimple(obj.TextureID);
        if (!o.resolvedAt)
        {
            o.resolvedAt = new Date().getTime() / 1000;
        }
        {
            const evt = new ObjectResolvedEvent();
            evt.object = o;
            this.clientEvents.onObjectResolvedEvent.next(evt);
        }
        if (o.Flags !== undefined)
        {
            // tslint:disable-next-line:no-bitwise
            // noinspection JSBitwiseOperatorUsage
            if (o.Flags & PrimFlags.CreateSelected)
            {
                const evt = new SelectedObjectEvent();
                evt.object = o;
                this.clientEvents.onSelectedObjectEvent.next(evt);
            }
        }
    }

    protected async requestMissingObject(localID: number, attempt = 0): Promise<void>
    {
        if (this.requestedObjects[localID])
        {
            return;
        }
        if (this.circuit === undefined)
        {
            return;
        }
        this.requestedObjects[localID] = true;
        const rmo = new RequestMultipleObjectsMessage();
        rmo.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        rmo.ObjectData = [];
        rmo.ObjectData.push({
            CacheMissType: 0,
            ID: localID
        });
        this.circuit.sendMessage(rmo, PacketFlags.Reliable);

        const selectObject = new ObjectSelectMessage();
        selectObject.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        selectObject.ObjectData = [
                {
                    'ObjectLocalID': localID
                }
            ];
        this.circuit.sendMessage(selectObject, PacketFlags.Reliable);

        try
        {
            await this.circuit.waitForMessage<ObjectUpdateMessage>(Message.ObjectUpdate, 10000, (message: ObjectUpdateMessage): FilterResponse =>
            {
                for (const obj of message.ObjectData)
                {
                    if (obj.ID === localID)
                    {
                        return FilterResponse.Finish;
                    }
                }
                return FilterResponse.NoMatch;
            });
            delete this.requestedObjects[localID];
        }
        catch (error)
        {
            delete this.requestedObjects[localID];
            if (attempt < 5)
            {
                await this.requestMissingObject(localID, ++attempt);
            }
            else
            {
                if (!this.circuit)
                {
                    return;
                }
                console.error('Error retrieving missing object after 5 attempts: ' + localID);
                console.error(error);
            }
        }
        finally
        {
            if (this.circuit)
            {
                const deselectObject = new ObjectDeselectMessage();
                deselectObject.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: this.circuit.sessionID
                };
                deselectObject.ObjectData = [
                    {
                        'ObjectLocalID': localID
                    }
                ];
                this.circuit.sendMessage(deselectObject, PacketFlags.Reliable);
            }
        }
    }

    protected objectUpdate(objectUpdate: ObjectUpdateMessage): void
    {
        for (const objData of objectUpdate.ObjectData)
        {
            const localID = objData.ID;
            const parentID = objData.ParentID;
            let addToParentList = true;
            let newObject = false;

            if (this.objects[localID])
            {
                if (this.objects[localID].ParentID !== parentID && this.objectsByParent[parentID])
                {
                    const ind = this.objectsByParent[parentID].indexOf(localID);
                    if (ind !== -1)
                    {
                        this.objectsByParent[parentID].splice(ind, 1);
                    }
                }
                else if (this.objectsByParent[parentID])
                {
                    addToParentList = false;
                }
            }
            else
            {
                newObject = true;
                this.objects[localID] = new GameObject();
                this.objects[localID].region = this.agent.currentRegion;
            }

            const obj = this.objects[localID];
            obj.deleted = false;
            obj.ID = objData.ID;
            obj.FullID = objData.FullID;
            obj.ParentID = objData.ParentID;
            obj.OwnerID = objData.OwnerID;
            obj.PCode = objData.PCode;

            this.objects[localID].NameValue = this.parseNameValues(Utils.BufferToStringSimple(objData.NameValue));

            this.objects[localID].IsAttachment = this.objects[localID].NameValue['AttachItemID'] !== undefined;
            if (obj.IsAttachment && obj.State !== undefined)
            {
                this.objects[localID].attachmentPoint = this.decodeAttachPoint(obj.State);
            }

            if (objData.PCode === PCode.Avatar && this.objects[localID].FullID.toString() === this.agent.agentID.toString())
            {
                this.agent.localID = localID;

                if (this.options & BotOptionFlags.StoreMyAttachmentsOnly)
                {
                    for (const objParentID of Object.keys(this.objectsByParent))
                    {
                        const parent = parseInt(objParentID, 10);
                        if (parent !== this.agent.localID)
                        {
                            let foundAvatars = false;
                            for (const objID of this.objectsByParent[parent])
                            {
                                if (this.objects[objID])
                                {
                                    const o = this.objects[objID];
                                    if (o.PCode === PCode.Avatar)
                                    {
                                        foundAvatars = true;
                                    }
                                }
                            }
                            if (this.objects[parent])
                            {
                                const o = this.objects[parent];
                                if (o.PCode === PCode.Avatar)
                                {
                                    foundAvatars = true;
                                }
                            }
                            if (!foundAvatars)
                            {
                                this.deleteObject(parent);
                            }
                        }
                    }
                }
            }

            this.objectsByUUID[objData.FullID.toString()] = localID;
            if (!this.objectsByParent[parentID])
            {
                this.objectsByParent[parentID] = [];
            }
            if (addToParentList)
            {
                this.objectsByParent[parentID].push(localID);
            }

            if (objData.PCode !== PCode.Avatar && this.options & BotOptionFlags.StoreMyAttachmentsOnly)
            {
                if (this.agent.localID !== 0 && obj.ParentID !== this.agent.localID)
                {
                    // Drop object
                    this.deleteObject(localID);
                    return;
                }
            }

            this.notifyObjectUpdate(newObject, obj);

            if (objData.ParentID !== undefined && objData.ParentID !== 0 && !this.objects[objData.ParentID])
            {
                this.requestMissingObject(objData.ParentID);
            }
        }
    }

    protected notifyTerseUpdate(obj: GameObject): void
    {
        if (this.objects[obj.ID])
        {
            if (obj.PCode === PCode.Avatar)
            {
                if (this.agent.currentRegion.agents[obj.FullID.toString()] !== undefined)
                {
                    this.agent.currentRegion.agents[obj.FullID.toString()].processObjectUpdate(obj);
                }
                else
                {
                    console.warn('Received update for unknown avatar, but not a new object?!');
                }
            }
            const updObj = new ObjectUpdatedEvent();
            updObj.localID = obj.ID;
            updObj.objectID = obj.FullID;
            updObj.object = obj;
            this.clientEvents.onObjectUpdatedTerseEvent.next(updObj);
        }
    }

    protected notifyObjectUpdate(newObject: boolean, obj: GameObject): void
    {
        if (obj.PCode === PCode.Avatar)
        {
            const avatarID = obj.FullID.toString();
            if (newObject)
            {
                if (this.agent.currentRegion.agents[avatarID] === undefined)
                {
                    const av = Avatar.fromGameObject(obj);
                    this.agent.currentRegion.agents[avatarID] = av;
                    this.clientEvents.onAvatarEnteredRegion.next(av)
                }
                else
                {
                    this.agent.currentRegion.agents[avatarID].processObjectUpdate(obj);
                }
            }
            else
            {
                if (this.agent.currentRegion.agents[avatarID] !== undefined)
                {
                    this.agent.currentRegion.agents[avatarID].processObjectUpdate(obj);
                }
                else
                {
                    console.warn('Received update for unknown avatar, but not a new object?!');
                }
            }
        }
        if (obj.ParentID === 0 || (obj.ParentID !== undefined && this.objects[obj.ParentID] !== undefined && this.objects[obj.ParentID].PCode === PCode.Avatar))
        {
            if (newObject)
            {
                if (obj.IsAttachment && obj.ParentID !== undefined)
                {
                    if (this.objects[obj.ParentID] !== undefined && this.objects[obj.ParentID].PCode === PCode.Avatar)
                    {
                        const avatar = this.agent.currentRegion.agents[this.objects[obj.ParentID].FullID.toString()];

                        let invItemID = UUID.zero();
                        if (obj.NameValue['AttachItemID'])
                        {
                            invItemID = new UUID(obj.NameValue['AttachItemID'].value);
                        }

                        this.agent.currentRegion.clientCommands.region.resolveObject(obj, true, false).then(() =>
                        {
                            try
                            {
                                if (obj.itemID === undefined)
                                {
                                    obj.itemID = UUID.zero();
                                }
                                obj.itemID = invItemID;
                                if (avatar !== undefined)
                                {
                                    avatar.addAttachment(obj);
                                }
                            }
                            catch (err)
                            {
                                console.error(err);
                            }
                        }).catch(() =>
                        {
                            console.error('Failed to resolve new avatar attachment');
                        });

                    }
                }

                const newObj = new NewObjectEvent();
                newObj.localID = obj.ID;
                newObj.objectID = obj.FullID;
                newObj.object = obj;
                newObj.createSelected = obj.Flags !== undefined && (obj.Flags & PrimFlags.CreateSelected) !== 0;
                obj.createdSelected = newObj.createSelected;
                // tslint:disable-next-line:no-bitwise
                // noinspection JSBitwiseOperatorUsage
                if (obj.Flags !== undefined && obj.Flags & PrimFlags.CreateSelected && !this.pendingObjectProperties[obj.FullID.toString()])
                {
                    this.selectedPrimsWithoutUpdate[obj.ID] = true;
                }
                this.clientEvents.onNewObjectEvent.next(newObj);
            }
            else
            {
                const updObj = new ObjectUpdatedEvent();
                updObj.localID = obj.ID;
                updObj.objectID = obj.FullID;
                updObj.object = obj;
                this.clientEvents.onObjectUpdatedEvent.next(updObj);
            }
            if (this.pendingObjectProperties[obj.FullID.toString()])
            {
                this.applyObjectProperties(obj, this.pendingObjectProperties[obj.FullID.toString()]);
                delete this.pendingObjectProperties[obj.FullID.toString()];
            }
        }
    }

    protected objectUpdateCached(objectUpdateCached: ObjectUpdateCachedMessage): void
    {
        if (this.circuit === undefined)
        {
            return;
        }
        const rmo = new RequestMultipleObjectsMessage();
        rmo.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        rmo.ObjectData = [];
        for (const obj of objectUpdateCached.ObjectData)
        {
            rmo.ObjectData.push({
                CacheMissType: 0,
                ID: obj.ID
            });
        }
        this.circuit.sendMessage(rmo, 0);
    }

    protected objectUpdateCompressed(objectUpdateCompressed: ObjectUpdateCompressedMessage): void
    {
        for (const obj of objectUpdateCompressed.ObjectData)
        {
            const buf = obj.Data;
            let pos = 0;

            const fullID = new UUID(buf, pos);
            pos += 16;
            const localID = buf.readUInt32LE(pos);
            pos += 4;
            const pcode = buf.readUInt8(pos++);
            let newObj = false;
            if (!this.objects[localID])
            {
                newObj = true;
                this.objects[localID] = new GameObject();
                this.objects[localID].region = this.agent.currentRegion;
            }
            const o = this.objects[localID];
            o.deleted = false;
            o.ID = localID;
            o.PCode = pcode;
            this.objectsByUUID[fullID.toString()] = localID;
            o.FullID = fullID;


            pos++;

            pos = pos + 42;
            const compressedflags: CompressedFlags = buf.readUInt32LE(pos);
            pos = pos + 4;
            o.OwnerID = new UUID(buf, pos);
            pos += 16;

            if (compressedflags & CompressedFlags.HasAngularVelocity)
            {
                pos = pos + 12;
            }
            let newParentID = 0;
            if (compressedflags & CompressedFlags.HasParent)
            {
                newParentID = buf.readUInt32LE(pos);
                pos += 4;
            }

            o.ParentID = newParentID;
            let add = true;
            if (!newObj && o.ParentID !== undefined)
            {
                if (newParentID !== o.ParentID)
                {
                    const index = this.objectsByParent[o.ParentID].indexOf(localID);
                    if (index !== -1)
                    {
                        this.objectsByParent[o.ParentID].splice(index, 1);
                    }
                }
                else if (this.objectsByParent[o.ParentID])
                {
                    add = false;
                }
            }
            if (add)
            {
                if (!this.objectsByParent[newParentID])
                {
                    this.objectsByParent[newParentID] = [];
                }
                this.objectsByParent[newParentID].push(localID);
            }
            if (pcode !== PCode.Avatar && newObj && this.options & BotOptionFlags.StoreMyAttachmentsOnly)
            {
                if (this.agent.localID !== 0 && o.ParentID !== this.agent.localID)
                {
                    // Drop object
                    this.deleteObject(localID);
                    return;
                }
            }
            if (o.ParentID !== undefined && o.ParentID !== 0 && !this.objects[o.ParentID])
            {
                this.requestMissingObject(o.ParentID);
            }
            if (compressedflags & CompressedFlags.Tree)
            {
                pos++;
            }
            else if (compressedflags & CompressedFlags.ScratchPad)
            {
                const scratchPadSize = buf.readUInt8(pos++);
                // Ignore this data
                pos = pos + scratchPadSize;
            }
            if (compressedflags & CompressedFlags.HasText)
            {
                // Read null terminated string
                const result = Utils.BufferToString(buf, pos);

                pos += result.readLength;
                pos = pos + 4;
            }
            if (compressedflags & CompressedFlags.MediaURL)
            {
                const result = Utils.BufferToString(buf, pos);

                pos += result.readLength;
            }
            if (compressedflags & CompressedFlags.HasParticles)
            {
                pos += 86;
            }

            // Extra params
            const extraParamsLength = ExtraParams.getLengthOfParams(buf, pos);
            o.extraParams = ExtraParams.from(buf.slice(pos, pos + extraParamsLength));
            pos = pos + extraParamsLength;

            if (compressedflags & CompressedFlags.HasSound)
            {
                pos = pos + 25
            }
            if (compressedflags & CompressedFlags.HasNameValues)
            {
                const result = Utils.BufferToString(buf, pos);
                o.NameValue = this.parseNameValues(result.result);
                pos += result.readLength;
            }
            pos++;
            pos = pos + 22;
            const textureEntryLength = buf.readUInt32LE(pos);
            pos = pos + 4;
            pos = pos + textureEntryLength;
            if (compressedflags & CompressedFlags.TextureAnimation)
            {
                pos = pos + 4;
            }

            o.IsAttachment = (compressedflags & CompressedFlags.HasNameValues) !== 0 && o.ParentID !== 0;
            if (o.IsAttachment && o.State !== undefined)
            {
                o.attachmentPoint = this.decodeAttachPoint(o.State);
            }

            this.notifyObjectUpdate(newObj, o);
        }
    }

    protected decodeAttachPoint(state: number): number
    {
        const mask = 0xf << 4 >>> 0;
        return (((state & mask) >>> 4) | ((state & ~mask) << 4)) >>> 0;
    }

    protected objectUpdateTerse(_objectUpdateTerse: ImprovedTerseObjectUpdateMessage): void
    {

    }

    protected killObject(killObj: KillObjectMessage): void
    {
        for (const obj of killObj.ObjectData)
        {
            const objectID = obj.ID;
            if (this.objects[objectID])
            {
                this.deleteObject(objectID);
            }
        }
    }

    setPersist(persist: boolean): void
    {
        this.persist = persist;
        if (!this.persist)
        {
            for (const d of this.deadObjects)
            {
                this.deleteObject(d);
            }
            this.deadObjects = [];
        }
    }

    deleteObject(objectID: number): void
    {
        if (this.objects[objectID])
        {
            const objectUUID = this.objects[objectID].FullID;
            const obj = this.objects[objectID];
            obj.deleted = true;

            if (this.persist)
            {
                this.deadObjects.push(objectID);
                return;
            }

            if (obj.IsAttachment && obj.ParentID !== undefined)
            {
                if (this.objects[obj.ParentID] !== undefined && this.objects[obj.ParentID].PCode === PCode.Avatar)
                {
                    this.agent.currentRegion.agents[this.objects[obj.ParentID].FullID.toString()]?.removeAttachment(obj);
                }
            }

            if (this.agent.currentRegion.agents[objectUUID.toString()] !== undefined)
            {
                this.agent.currentRegion.agents[objectUUID.toString()].isVisible = false;
            }

            // First, kill all children (not the people kind)
            if (this.objectsByParent[objectID])
            {
                for (const childObjID of this.objectsByParent[objectID])
                {
                    this.deleteObject(childObjID);
                }
            }
            delete this.objectsByParent[objectID];

            // Now delete this object
            const uuid = obj.FullID.toString();

            if (this.objectsByUUID[uuid])
            {
                delete this.objectsByUUID[uuid];
            }
            if (obj.ParentID !== undefined)
            {
                const parentID = obj.ParentID;
                if (this.objectsByParent[parentID])
                {
                    const ind = this.objectsByParent[parentID].indexOf(objectID);
                    if (ind !== -1)
                    {
                        this.objectsByParent[parentID].splice(ind, 1);
                    }
                }
            }
            if (this.rtree && obj.rtreeEntry !== undefined)
            {
                this.rtree.remove(obj.rtreeEntry);
            }
            delete this.objects[objectID];
        }
    }
    getObjectsByParent(parentID: number): GameObject[]
    {
        const list = this.objectsByParent[parentID];
        if (list === undefined)
        {
            return [];
        }
        const result: GameObject[] = [];
        for (const localID of list)
        {
            if (this.objects[localID])
            {
                result.push(this.objects[localID]);
            }
        }
        result.sort((a: GameObject, b: GameObject) =>
        {
            return a.ID - b.ID;
        });
        return result;
    }

    parseNameValues(str: string): { [key: string]: NameValue }
    {
        const nv: { [key: string]: NameValue } = {};
        const lines = str.split('\n');
        for (const line of lines)
        {
            if (line.length > 0)
            {
                let kv = line.split(/[\t ]/);
                if (kv.length > 5)
                {
                    for (let x = 5; x < kv.length; x++)
                    {
                        kv[4] += ' ' + kv[x];
                    }
                    kv = kv.slice(0, 5);
                }
                if (kv.length === 5)
                {
                    const namevalue = new NameValue();
                    namevalue.type = kv[1];
                    namevalue.class = kv[2];
                    namevalue.sendTo = kv[3];
                    namevalue.value = kv[4];
                    nv[kv[0]] = namevalue;
                }
            }
        }
        return nv;
    }

    shutdown(): void
    {
        if (this.selectedChecker !== undefined)
        {
            clearInterval(this.selectedChecker);
            delete this.selectedChecker;
        }
        this.physicsSubscription.unsubscribe();
        this.objects = {};
        if (this.rtree)
        {
            this.rtree.clear();
        }
        this.objectsByUUID = {};
        this.objectsByParent = {};
        delete this.circuit;
    }

    protected findParent(go: GameObject): GameObject
    {
        if (go.ParentID !== undefined && go.ParentID !== 0 && this.objects[go.ParentID])
        {
            return this.findParent(this.objects[go.ParentID]);
        }
        else
        {
            if (go.ParentID !== undefined && go.ParentID !== 0 && !this.objects[go.ParentID])
            {
                this.requestMissingObject(go.ParentID).catch((e: unknown) =>
                {
                    Logger.Error(e);
                });
            }
            return go;
        }
    }

    populateChildren(obj: GameObject, _resolve = false): void
    {
        if (obj !== undefined)
        {
            obj.children = [];
            obj.totalChildren = 0;
            for (const child of this.getObjectsByParent(obj.ID))
            {
                if (child.PCode !== PCode.Avatar)
                {
                    obj.totalChildren++;
                    this.populateChildren(child);
                    if (child.totalChildren !== undefined)
                    {
                        obj.totalChildren += child.totalChildren;
                    }
                    obj.children.push(child);
                }
            }
        }
    }

    async getAllObjects(): Promise<GameObject[]>
    {
        const results = [];
        const found: { [key: string]: GameObject } = {};
        for (const k of Object.keys(this.objects))
        {
            const go = this.objects[parseInt(k, 10)];
            if (go.PCode !== PCode.Avatar && (go.IsAttachment === undefined || !go.IsAttachment))
            {
                try
                {
                    const parent = this.findParent(go);
                    if (parent.ParentID === 0)
                    {
                        const uuid = parent.FullID.toString();

                        if (found[uuid] === undefined)
                        {
                            found[uuid] = parent;
                            results.push(parent);
                        }
                    }
                }
                catch (error)
                {
                    console.log('Failed to find parent for ' + go.FullID.toString());
                    console.error(error);
                    // Unable to find parent, full object probably not fully loaded yet
                }
            }
        }

        // Now populate children of each found object
        for (const obj of results)
        {
            this.populateChildren(obj);
        }

        return results;
    }


    getNumberOfObjects(): number
    {
        return Object.keys(this.objects).length;
    }

    async getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): Promise<GameObject[]>
    {
        if (!this.rtree)
        {
            throw new Error('GetObjectsInArea not available with the Lite object store');
        }
        const result = this.rtree.search({
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY,
            minZ: minZ,
            maxZ: maxZ
        });
        const found: { [key: string]: GameObject } = {};
        const objs: GameObject[] = [];
        for (const obj of result)
        {
            const o = obj as ITreeBoundingBox;
            const go = o.gameObject as GameObject;
            if (go.PCode !== PCode.Avatar && (go.IsAttachment === undefined || !go.IsAttachment))
            {
                try
                {
                    const parent = this.findParent(go);
                    if (parent.PCode !== PCode.Avatar && (parent.IsAttachment === undefined || !parent.IsAttachment) && parent.ParentID === 0)
                    {
                        const uuid = parent.FullID.toString();

                        if (found[uuid] === undefined)
                        {
                            found[uuid] = parent;
                            objs.push(parent);
                        }
                    }
                }
                catch (error)
                {
                    console.log('Failed to find parent for ' + go.FullID.toString());
                    console.error(error);
                    // Unable to find parent, full object probably not fully loaded yet
                }
            }
        }

        // Now populate children of each found object
        for (const obj of objs)
        {
            this.populateChildren(obj);
        }

        return objs;
    }

    getObjectByUUID(fullID: UUID | string): GameObject
    {
        if (fullID instanceof UUID)
        {
            fullID = fullID.toString();
        }
        if (!this.objectsByUUID[fullID])
        {
            throw new Error('No object found with that UUID');
        }
        const localID: number = this.objectsByUUID[fullID];
        return this.objects[localID];
    }

    getObjectByLocalID(localID: number): GameObject
    {
        if (!this.objects[localID])
        {
            throw new Error('No object found with that UUID');
        }
        return this.objects[localID];
    }

    insertIntoRtree(obj: GameObject): void
    {
        if (!this.rtree)
        {
            return;
        }
        if (obj.rtreeEntry !== undefined)
        {
            this.rtree.remove(obj.rtreeEntry);
        }
        if (!obj.Scale || !obj.Position || !obj.Rotation)
        {
            return;
        }
        const normalizedScale = new Vector3(obj.Scale).multiplyByTSMQuat(new Quaternion(obj.Rotation));

        const bounds: ITreeBoundingBox = {
            minX: obj.Position.x - (normalizedScale.x / 2),
            maxX: obj.Position.x + (normalizedScale.x / 2),
            minY: obj.Position.y - (normalizedScale.y / 2),
            maxY: obj.Position.y + (normalizedScale.y / 2),
            minZ: obj.Position.z - (normalizedScale.z / 2),
            maxZ: obj.Position.z + (normalizedScale.z / 2),
            gameObject: obj
        };

        obj.rtreeEntry = bounds;
        this.rtree.insert(bounds);
    }
}
