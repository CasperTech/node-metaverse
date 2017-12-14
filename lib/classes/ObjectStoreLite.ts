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
import {CompressedFlags} from '../enums/CompressedFlags';
import {ExtraParamType} from '../enums/ExtraParamType';
import {Utils} from './Utils';
import {PCode} from '../enums/PCode';
import {ClientEvents} from './ClientEvents';
import {KillObjectMessage} from './messages/KillObject';
import {IObjectStore} from './interfaces/IObjectStore';
import {GameObjectLite} from './GameObjectLite';
import {NameValue} from './NameValue';
import {BotOptionFlags} from '../enums/BotOptionFlags';

export class ObjectStoreLite implements IObjectStore
{
    private circuit: Circuit;
    private agent: Agent;
    private objects: { [key: number]: GameObjectLite } = {};
    private objectsByUUID: { [key: string]: number } = {};
    private objectsByParent: { [key: number]: number[] } = {};
    private clientEvents: ClientEvents;
    private options: BotOptionFlags;

    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags)
    {
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
                            this.objects[localID] = new GameObjectLite();
                        }

                        const obj = this.objects[localID];
                        obj.ID = objData.ID;
                        obj.FullID = objData.FullID;
                        obj.ParentID = objData.ParentID;
                        obj.OwnerID = objData.OwnerID;

                        this.objects[localID].NameValue = this.parseNameValues(Utils.BufferToStringSimple(objData.NameValue));

                        if (objData.PCode === PCode.Avatar && this.objects[localID].FullID.toString() === this.agent.agentID.toString())
                        {
                            this.agent.localID = localID;
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

                        if (this.options & BotOptionFlags.StoreMyAttachmentsOnly)
                        {
                            if (this.agent.localID !== 0 && obj.ParentID !== this.agent.localID)
                            {
                                // Drop object
                                this.deleteObject(localID);
                                return;
                            }
                        }
                    });
                    break;
                case Message.ObjectUpdateCached:
                    const objectUpdateCached = packet.message as ObjectUpdateCachedMessage;
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
                    circuit.sendMessage(rmo, 0);
                    break;
                case Message.ObjectUpdateCompressed:
                {
                    const objectUpdateCompressed = packet.message as ObjectUpdateCompressedMessage;
                    objectUpdateCompressed.ObjectData.forEach((obj) =>
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
                            this.objects[localID] = new GameObjectLite();
                        }
                        const o = this.objects[localID];
                        o.ID = localID;
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
                        if (newObj && this.options & BotOptionFlags.StoreMyAttachmentsOnly)
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

                    });

                    break;
                }
                case Message.ImprovedTerseObjectUpdate:
                    const objectUpdateTerse = packet.message as ImprovedTerseObjectUpdateMessage;
                    // TODO: ImprovedTerseObjectUPdate
                    break;
                case Message.MultipleObjectUpdate:
                    const multipleObjectUpdate = packet.message as MultipleObjectUpdateMessage;
                    // TODO: multipleObjectUpdate
                    console.error('TODO: MultipleObjectUpdate');
                    break;
                case Message.KillObject:
                    const killObj = packet.message as KillObjectMessage;
                    killObj.ObjectData.forEach((obj) =>
                    {
                        const objectID = obj.ID;
                        this.deleteObject(objectID);
                    });
                    break;
            }
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
            delete this.objects[objectID];
        }
    }

    readExtraParams(buf: Buffer, pos: number, o: GameObjectLite): number
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

    getObjectsByParent(parentID: number): GameObjectLite[]
    {
        const list = this.objectsByParent[parentID];
        if (list === undefined)
        {
            return [];
        }
        const result: GameObjectLite[] = [];
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
        this.objectsByUUID = {};
        this.objectsByParent = {};
    }
}
