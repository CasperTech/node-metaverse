import {Circuit} from './Circuit';
import {Packet} from './Packet';
import {Message} from '../enums/Message';
import {ObjectUpdateMessage} from './messages/ObjectUpdate';
import {ObjectUpdateCachedMessage} from './messages/ObjectUpdateCached';
import {ObjectUpdateCompressedMessage} from './messages/ObjectUpdateCompressed';
import {ImprovedTerseObjectUpdateMessage} from './messages/ImprovedTerseObjectUpdate';
import {MultipleObjectUpdateMessage} from './messages/MultipleObjectUpdate';
import {RequestMultipleObjectsMessage} from './messages/RequestMultipleObjects';
import {Agent} from './Agent';
import {UUID} from './UUID';
import {ExtraParamType} from '../enums/ExtraParamType';
import {Utils} from './Utils';
import {PCode} from '../enums/PCode';
import {ClientEvents} from './ClientEvents';
import {KillObjectMessage} from './messages/KillObject';
import {IObjectStore} from './interfaces/IObjectStore';
import {NameValue} from './NameValue';
import {BotOptionFlags, CompressedFlags} from '..';
import {GameObject} from './GameObject';
import {RBush3D} from 'rbush-3d/dist';
import {ITreeBoundingBox} from './interfaces/ITreeBoundingBox';

export class ObjectStoreLite implements IObjectStore
{
    protected circuit: Circuit;
    protected agent: Agent;
    protected objects: { [key: number]: GameObject } = {};
    protected objectsByUUID: { [key: string]: number } = {};
    protected objectsByParent: { [key: number]: number[] } = {};
    protected clientEvents: ClientEvents;
    protected options: BotOptionFlags;

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
            Message.MultipleObjectUpdate,
            Message.KillObject
        ], (packet: Packet) =>
        {
            switch (packet.message.id)
            {
                case Message.ObjectUpdate:
                    const objectUpdate = packet.message as ObjectUpdateMessage;
                    this.objectUpdate(objectUpdate);
                    break;
                case Message.ObjectUpdateCached:
                    const objectUpdateCached = packet.message as ObjectUpdateCachedMessage;
                    this.objectUpdateCached(objectUpdateCached);
                    break;
                case Message.ObjectUpdateCompressed:
                {
                    const objectUpdateCompressed = packet.message as ObjectUpdateCompressedMessage;
                    this.objectUpdateCompressed(objectUpdateCompressed);
                    break;
                }
                case Message.ImprovedTerseObjectUpdate:
                    const objectUpdateTerse = packet.message as ImprovedTerseObjectUpdateMessage;
                    this.objectUpdateTerse(objectUpdateTerse);
                    break;
                case Message.MultipleObjectUpdate:
                    const multipleObjectUpdate = packet.message as MultipleObjectUpdateMessage;
                    this.objectUpdateMultiple(multipleObjectUpdate);
                    break;
                case Message.KillObject:
                    const killObj = packet.message as KillObjectMessage;
                    this.killObject(killObj);
                    break;
            }
        });
    }

    protected objectUpdate(objectUpdate: ObjectUpdateMessage)
    {
        objectUpdate.ObjectData.forEach((objData) =>
        {
            const localID = objData.ID;
            const parentID = objData.ParentID;
            let addToParentList = true;

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
                else
                {
                    addToParentList = false;
                }
            }
            else
            {
                this.objects[localID] = new GameObject();
            }

            const obj = this.objects[localID];
            obj.ID = objData.ID;
            obj.FullID = objData.FullID;
            obj.ParentID = objData.ParentID;
            obj.OwnerID = objData.OwnerID;
            obj.PCode = objData.PCode;

            this.objects[localID].NameValue = this.parseNameValues(Utils.BufferToStringSimple(objData.NameValue));

            if (objData.PCode === PCode.Avatar && this.objects[localID].FullID.toString() === this.agent.agentID.toString())
            {
                this.agent.localID = localID;

                if (this.options & BotOptionFlags.StoreMyAttachmentsOnly)
                {
                    Object.keys(this.objectsByParent).forEach((objParentID: string) =>
                    {
                        const parent = parseInt(objParentID, 10);
                        if (parent !== this.agent.localID)
                        {
                            let foundAvatars = false;
                            this.objectsByParent[parent].forEach((objID) =>
                            {
                                if (this.objects[objID])
                                {
                                    const o = this.objects[objID];
                                    if (o.PCode === PCode.Avatar)
                                    {
                                        foundAvatars = true;
                                    }
                                }
                            });
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
                    });
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
        });
    }

    protected objectUpdateCached(objectUpdateCached: ObjectUpdateCachedMessage)
    {
        const rmo = new RequestMultipleObjectsMessage();
        rmo.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        rmo.ObjectData = [];
        objectUpdateCached.ObjectData.forEach((obj) =>
        {
            rmo.ObjectData.push({
                CacheMissType: 0,
                ID: obj.ID
            });
        });
        this.circuit.sendMessage(rmo, 0);
    }

    protected objectUpdateCompressed(objectUpdateCompressed: ObjectUpdateCompressedMessage)
    {
        for (const obj of objectUpdateCompressed.ObjectData)
        {
            const flags = obj.UpdateFlags;
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
            }
            const o = this.objects[localID];
            o.ID = localID;
            o.PCode = pcode;
            this.objectsByUUID[fullID.toString()] = localID;
            o.FullID = fullID;


            pos++;

            pos = pos + 4;
            pos++;
            pos++;

            pos = pos + 12;

            pos = pos + 12;

            pos = pos + 12;
            const compressedflags: CompressedFlags = buf.readUInt32LE(pos);
            pos = pos + 4;
            o.OwnerID = new UUID(buf, pos);
            pos += 16;

            if (compressedflags & CompressedFlags.HasAngularVelocity)
            {
                pos = pos + 12;
            }
            if (compressedflags & CompressedFlags.HasParent)
            {
                const newParentID = buf.readUInt32LE(pos);
                pos += 4;
                let add = true;
                if (!newObj)
                {
                    if (newParentID !== o.ParentID)
                    {
                        const index = this.objectsByParent[o.ParentID].indexOf(localID);
                        if (index !== -1)
                        {
                            this.objectsByParent[o.ParentID].splice(index, 1);
                        }
                    }
                    else
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
                o.ParentID = newParentID;
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
                // TODO: Particle system block
                pos += 86;
            }

            // Extra params
            pos = this.readExtraParams(buf, pos, o);

            if (compressedflags & CompressedFlags.HasSound)
            {
                pos = pos + 16;
                pos += 4;
                pos++;
                pos = pos + 4;
            }
            if (compressedflags & CompressedFlags.HasNameValues)
            {
                const result = Utils.BufferToString(buf, pos);
                o.NameValue = this.parseNameValues(result.result);
                pos += result.readLength;
            }
            pos++;
            pos = pos + 2;
            pos = pos + 2;
            pos = pos + 12;
            pos = pos + 2;
            pos = pos + 2;
            pos = pos + 2;
            const textureEntryLength = buf.readUInt32LE(pos);
            pos = pos + 4;
            // TODO: Properly parse textureentry;
            pos = pos + textureEntryLength;

            if (compressedflags & CompressedFlags.TextureAnimation)
            {
                // TODO: Properly parse textureAnim
                pos = pos + 4;
            }

            o.IsAttachment = (compressedflags & CompressedFlags.HasNameValues) !== 0 && o.ParentID !== 0;
        }
    }

    protected objectUpdateTerse(objectUpdateTerse: ImprovedTerseObjectUpdateMessage)
    {    }

    protected objectUpdateMultiple(objectUpdateMultiple: MultipleObjectUpdateMessage)
    {    }

    protected killObject(killObj: KillObjectMessage)
    {
        killObj.ObjectData.forEach((obj) =>
        {
            const objectID = obj.ID;
            this.deleteObject(objectID);
        });
    }

    deleteObject(objectID: number)
    {
        if (this.objects[objectID])
        {
            // First, kill all children
            if (this.objectsByParent[objectID])
            {
                this.objectsByParent[objectID].forEach((childObjID) =>
                {
                    this.deleteObject(childObjID);
                });
            }
            delete this.objectsByParent[objectID];

            // Now delete this object
            const objct = this.objects[objectID];
            const uuid = objct.FullID.toString();

            if (this.objectsByUUID[uuid])
            {
                delete this.objectsByUUID[uuid];
            }
            const parentID = objct.ParentID;
            if (this.objectsByParent[parentID])
            {
                const ind = this.objectsByParent[parentID].indexOf(objectID);
                if (ind !== -1)
                {
                    this.objectsByParent[parentID].splice(ind, 1);
                }
            }
            if (this.rtree && this.objects[objectID].rtreeEntry !== undefined)
            {
                this.rtree.remove(this.objects[objectID].rtreeEntry);
            }
            delete this.objects[objectID];
        }
    }

    readExtraParams(buf: Buffer, pos: number, o: GameObject): number
    {
        if (pos >= buf.length)
        {
            return 0;
        }
        const extraParamCount = buf.readUInt8(pos++);
        for (let k = 0; k < extraParamCount; k++)
        {
            const type: ExtraParamType = buf.readUInt16LE(pos);
            pos = pos + 2;
            const paramLength = buf.readUInt32LE(pos);
            pos = pos + 4;

            // TODO: Read extra param data
            pos += paramLength;
        }
        return pos;
    }

    getObjectsByParent(parentID: number): GameObject[]
    {
        const list = this.objectsByParent[parentID];
        if (list === undefined)
        {
            return [];
        }
        const result: GameObject[] = [];
        list.forEach((localID) =>
        {
            result.push(this.objects[localID]);
        });
        return result;
    }

    parseNameValues(str: string): { [key: string]: NameValue }
    {
        const nv: { [key: string]: NameValue } = {};
        const lines = str.split('\n');
        lines.forEach((line) =>
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
                else
                {
                    console.log('namevalue unexpected length: ' + kv.length);
                    console.log(kv);
                }
            }
        });
        return nv;
    }

    shutdown()
    {
        this.objects = {};
        if (this.rtree)
        {
            this.rtree.clear();
        }
        this.objectsByUUID = {};
        this.objectsByParent = {};
    }

    protected findParent(go: GameObject): GameObject
    {
        if (go.ParentID !== 0 && this.objects[go.ParentID])
        {
            return this.findParent(this.objects[go.ParentID]);
        }
        else
        {
            return go;
        }
    }

    private populateChildren(obj: GameObject)
    {
        obj.children = [];
        obj.totalChildren = 0;
        for (const child of this.getObjectsByParent(obj.ID))
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

    getNumberOfObjects()
    {
        return Object.keys(this.objects).length;
    }

    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): GameObject[]
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
        const found: {[key: string]: GameObject} = {};
        const objs: GameObject[] = [];
        for (const obj of result)
        {
            const o = obj as ITreeBoundingBox;
            const go = o.gameObject as GameObject;
            if (go.PCode !== PCode.Avatar && (go.IsAttachment === undefined || go.IsAttachment === false))
            {
                try
                {
                    const parent = this.findParent(go);
                    if (parent.PCode !== PCode.Avatar && (parent.IsAttachment === undefined || parent.IsAttachment === false))
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

    insertIntoRtree(obj: GameObject)
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
        const normalizedScale = obj.Scale.multiplyByQuat(obj.Rotation);
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
