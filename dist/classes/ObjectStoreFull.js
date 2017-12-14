"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../enums/Message");
const RequestMultipleObjects_1 = require("./messages/RequestMultipleObjects");
const UUID_1 = require("./UUID");
const Quaternion_1 = require("./Quaternion");
const Vector3_1 = require("./Vector3");
const CompressedFlags_1 = require("../enums/CompressedFlags");
const Utils_1 = require("./Utils");
const PCode_1 = require("../enums/PCode");
const NameValue_1 = require("./NameValue");
const GameObjectFull_1 = require("./GameObjectFull");
const BotOptionFlags_1 = require("../enums/BotOptionFlags");
class ObjectStoreFull {
    constructor(circuit, agent, clientEvents, options) {
        this.objects = {};
        this.objectsByUUID = {};
        this.objectsByParent = {};
        agent.localID = 0;
        this.options = options;
        this.clientEvents = clientEvents;
        this.circuit = circuit;
        this.agent = agent;
        this.circuit.subscribeToMessages([
            Message_1.Message.ObjectUpdate,
            Message_1.Message.ObjectUpdateCached,
            Message_1.Message.ObjectUpdateCompressed,
            Message_1.Message.ImprovedTerseObjectUpdate,
            Message_1.Message.MultipleObjectUpdate,
            Message_1.Message.KillObject
        ], (packet) => {
            switch (packet.message.id) {
                case Message_1.Message.ObjectUpdate:
                    const objectUpdate = packet.message;
                    objectUpdate.ObjectData.forEach((objData) => {
                        const localID = objData.ID;
                        const parentID = objData.ParentID;
                        let addToParentList = true;
                        if (this.objects[localID]) {
                            if (this.objects[localID].ParentID !== parentID && this.objectsByParent[parentID]) {
                                const ind = this.objectsByParent[parentID].indexOf(localID);
                                if (ind !== -1) {
                                    this.objectsByParent[parentID].splice(ind, 1);
                                }
                            }
                            else {
                                addToParentList = false;
                            }
                        }
                        else {
                            this.objects[localID] = new GameObjectFull_1.GameObjectFull();
                        }
                        const obj = this.objects[localID];
                        obj.ID = objData.ID;
                        obj.State = objData.State;
                        obj.FullID = objData.FullID;
                        obj.CRC = objData.CRC;
                        obj.PCode = objData.PCode;
                        obj.Material = objData.Material;
                        obj.ClickAction = objData.ClickAction;
                        obj.Scale = objData.Scale;
                        obj.ObjectData = objData.ObjectData;
                        obj.ParentID = objData.ParentID;
                        obj.Flags = objData.UpdateFlags;
                        obj.PathCurve = objData.PathCurve;
                        obj.ProfileCurve = objData.ProfileCurve;
                        obj.PathBegin = objData.PathBegin;
                        obj.PathEnd = objData.PathEnd;
                        obj.PathScaleX = objData.PathScaleX;
                        obj.PathScaleY = objData.PathScaleY;
                        obj.PathShearX = objData.PathShearX;
                        obj.PathShearY = objData.PathShearY;
                        obj.PathTwist = objData.PathTwist;
                        obj.PathTwistBegin = objData.PathTwistBegin;
                        obj.PathRadiusOffset = objData.PathRadiusOffset;
                        obj.PathTaperX = objData.PathTaperX;
                        obj.PathTaperY = objData.PathTaperY;
                        obj.PathRevolutions = objData.PathRevolutions;
                        obj.PathSkew = objData.PathSkew;
                        obj.ProfileBegin = objData.ProfileBegin;
                        obj.ProfileEnd = objData.ProfileEnd;
                        obj.ProfileHollow = objData.ProfileHollow;
                        obj.TextureEntry = objData.TextureEntry;
                        obj.TextureAnim = objData.TextureAnim;
                        obj.Data = objData.Data;
                        obj.Text = Utils_1.Utils.BufferToStringSimple(objData.Text);
                        obj.TextColor = objData.TextColor;
                        obj.MediaURL = Utils_1.Utils.BufferToStringSimple(objData.MediaURL);
                        obj.PSBlock = objData.PSBlock;
                        obj.Sound = objData.Sound;
                        obj.OwnerID = objData.OwnerID;
                        obj.SoundGain = objData.Gain;
                        obj.SoundFlags = objData.Flags;
                        obj.SoundRadius = objData.Radius;
                        obj.JointType = objData.JointType;
                        obj.JointPivot = objData.JointPivot;
                        obj.JointAxisOrAnchor = objData.JointAxisOrAnchor;
                        if (this.objects[localID].PCode === PCode_1.PCode.Avatar && this.objects[localID].FullID.toString() === this.agent.agentID.toString()) {
                            this.agent.localID = localID;
                            if (this.options & BotOptionFlags_1.BotOptionFlags.StoreMyAttachmentsOnly) {
                                Object.keys(this.objectsByParent).forEach((objParentID) => {
                                    const parent = parseInt(objParentID, 10);
                                    if (parent !== this.agent.localID) {
                                        this.deleteObject(parent);
                                    }
                                });
                            }
                        }
                        this.readExtraParams(objData.ExtraParams, 0, this.objects[localID]);
                        this.objects[localID].NameValue = this.parseNameValues(Utils_1.Utils.BufferToStringSimple(objData.NameValue));
                        this.objectsByUUID[objData.FullID.toString()] = localID;
                        if (!this.objectsByParent[parentID]) {
                            this.objectsByParent[parentID] = [];
                        }
                        if (addToParentList) {
                            this.objectsByParent[parentID].push(localID);
                        }
                        if (this.options & BotOptionFlags_1.BotOptionFlags.StoreMyAttachmentsOnly) {
                            if (this.agent.localID !== 0 && obj.ParentID !== this.agent.localID) {
                                this.deleteObject(localID);
                                return;
                            }
                        }
                    });
                    break;
                case Message_1.Message.ObjectUpdateCached:
                    const objectUpdateCached = packet.message;
                    const rmo = new RequestMultipleObjects_1.RequestMultipleObjectsMessage();
                    rmo.AgentData = {
                        AgentID: this.agent.agentID,
                        SessionID: this.circuit.sessionID
                    };
                    rmo.ObjectData = [];
                    objectUpdateCached.ObjectData.forEach((obj) => {
                        rmo.ObjectData.push({
                            CacheMissType: 0,
                            ID: obj.ID
                        });
                    });
                    circuit.sendMessage(rmo, 0);
                    break;
                case Message_1.Message.ObjectUpdateCompressed:
                    {
                        const objectUpdateCompressed = packet.message;
                        objectUpdateCompressed.ObjectData.forEach((obj) => {
                            const flags = obj.UpdateFlags;
                            const buf = obj.Data;
                            let pos = 0;
                            const fullID = new UUID_1.UUID(buf, pos);
                            pos += 16;
                            const localID = buf.readUInt32LE(pos);
                            pos += 4;
                            const pcode = buf.readUInt8(pos++);
                            let newObj = false;
                            if (!this.objects[localID]) {
                                newObj = true;
                                this.objects[localID] = new GameObjectFull_1.GameObjectFull();
                            }
                            const o = this.objects[localID];
                            o.ID = localID;
                            this.objectsByUUID[fullID.toString()] = localID;
                            o.FullID = fullID;
                            o.Flags = flags;
                            o.PCode = pcode;
                            o.State = buf.readUInt8(pos++);
                            o.CRC = buf.readUInt32LE(pos);
                            pos = pos + 4;
                            o.Material = buf.readUInt8(pos++);
                            o.ClickAction = buf.readUInt8(pos++);
                            o.Scale = new Vector3_1.Vector3(buf, pos, false);
                            pos = pos + 12;
                            o.Position = new Vector3_1.Vector3(buf, pos, false);
                            pos = pos + 12;
                            o.Rotation = new Quaternion_1.Quaternion(buf, pos);
                            pos = pos + 12;
                            const compressedflags = buf.readUInt32LE(pos);
                            pos = pos + 4;
                            o.OwnerID = new UUID_1.UUID(buf, pos);
                            pos += 16;
                            if (compressedflags & CompressedFlags_1.CompressedFlags.HasAngularVelocity) {
                                o.AngularVelocity = new Vector3_1.Vector3(buf, pos, false);
                                pos = pos + 12;
                            }
                            if (compressedflags & CompressedFlags_1.CompressedFlags.HasParent) {
                                const newParentID = buf.readUInt32LE(pos);
                                pos += 4;
                                let add = true;
                                if (!newObj) {
                                    if (newParentID !== o.ParentID) {
                                        const index = this.objectsByParent[o.ParentID].indexOf(localID);
                                        if (index !== -1) {
                                            this.objectsByParent[o.ParentID].splice(index, 1);
                                        }
                                    }
                                    else {
                                        add = false;
                                    }
                                }
                                if (add) {
                                    if (!this.objectsByParent[newParentID]) {
                                        this.objectsByParent[newParentID] = [];
                                    }
                                    this.objectsByParent[newParentID].push(localID);
                                }
                                o.ParentID = newParentID;
                            }
                            if (newObj && this.options & BotOptionFlags_1.BotOptionFlags.StoreMyAttachmentsOnly) {
                                if (this.agent.localID !== 0 && o.ParentID !== this.agent.localID) {
                                    this.deleteObject(localID);
                                    return;
                                }
                            }
                            if (compressedflags & CompressedFlags_1.CompressedFlags.Tree) {
                                o.TreeSpecies = buf.readUInt8(pos++);
                            }
                            else if (compressedflags & CompressedFlags_1.CompressedFlags.ScratchPad) {
                                o.TreeSpecies = 0;
                                const scratchPadSize = buf.readUInt8(pos++);
                                pos = pos + scratchPadSize;
                            }
                            if (compressedflags & CompressedFlags_1.CompressedFlags.HasText) {
                                const result = Utils_1.Utils.BufferToString(buf, pos);
                                pos += result.readLength;
                                o.Text = result.result;
                                o.TextColor = buf.slice(pos, pos + 4);
                                pos = pos + 4;
                            }
                            else {
                                o.Text = '';
                            }
                            if (compressedflags & CompressedFlags_1.CompressedFlags.MediaURL) {
                                const result = Utils_1.Utils.BufferToString(buf, pos);
                                pos += result.readLength;
                                o.MediaURL = result.result;
                            }
                            if (compressedflags & CompressedFlags_1.CompressedFlags.HasParticles) {
                                pos += 86;
                            }
                            pos = this.readExtraParams(buf, pos, o);
                            if (compressedflags & CompressedFlags_1.CompressedFlags.HasSound) {
                                o.Sound = new UUID_1.UUID(buf, pos);
                                pos = pos + 16;
                                o.SoundGain = buf.readFloatLE(pos);
                                pos += 4;
                                o.SoundFlags = buf.readUInt8(pos++);
                                o.SoundRadius = buf.readFloatLE(pos);
                                pos = pos + 4;
                            }
                            if (compressedflags & CompressedFlags_1.CompressedFlags.HasNameValues) {
                                const result = Utils_1.Utils.BufferToString(buf, pos);
                                o.NameValue = this.parseNameValues(result.result);
                                pos += result.readLength;
                            }
                            o.PathCurve = buf.readUInt8(pos++);
                            o.PathBegin = buf.readUInt16LE(pos);
                            pos = pos + 2;
                            o.PathEnd = buf.readUInt16LE(pos);
                            pos = pos + 2;
                            o.PathScaleX = buf.readUInt8(pos++);
                            o.PathScaleY = buf.readUInt8(pos++);
                            o.PathShearX = buf.readUInt8(pos++);
                            o.PathShearY = buf.readUInt8(pos++);
                            o.PathTwist = buf.readUInt8(pos++);
                            o.PathTwistBegin = buf.readUInt8(pos++);
                            o.PathRadiusOffset = buf.readUInt8(pos++);
                            o.PathTaperX = buf.readUInt8(pos++);
                            o.PathTaperY = buf.readUInt8(pos++);
                            o.PathRevolutions = buf.readUInt8(pos++);
                            o.PathSkew = buf.readUInt8(pos++);
                            o.ProfileCurve = buf.readUInt8(pos++);
                            o.ProfileBegin = buf.readUInt16LE(pos);
                            pos = pos + 2;
                            o.ProfileEnd = buf.readUInt16LE(pos);
                            pos = pos + 2;
                            o.ProfileHollow = buf.readUInt16LE(pos);
                            pos = pos + 2;
                            const textureEntryLength = buf.readUInt32LE(pos);
                            pos = pos + 4;
                            pos = pos + textureEntryLength;
                            if (compressedflags & CompressedFlags_1.CompressedFlags.TextureAnimation) {
                                pos = pos + 4;
                            }
                            o.IsAttachment = (compressedflags & CompressedFlags_1.CompressedFlags.HasNameValues) !== 0 && o.ParentID !== 0;
                        });
                        break;
                    }
                case Message_1.Message.ImprovedTerseObjectUpdate:
                    const objectUpdateTerse = packet.message;
                    break;
                case Message_1.Message.MultipleObjectUpdate:
                    const multipleObjectUpdate = packet.message;
                    console.error('TODO: MultipleObjectUpdate');
                    break;
                case Message_1.Message.KillObject:
                    const killObj = packet.message;
                    killObj.ObjectData.forEach((obj) => {
                        const objectID = obj.ID;
                        this.deleteObject(objectID);
                    });
                    break;
            }
        });
    }
    deleteObject(objectID) {
        if (this.objects[objectID]) {
            if (this.objectsByParent[objectID]) {
                this.objectsByParent[objectID].forEach((childObjID) => {
                    this.deleteObject(childObjID);
                });
            }
            delete this.objectsByParent[objectID];
            const objct = this.objects[objectID];
            const uuid = objct.FullID.toString();
            if (this.objectsByUUID[uuid]) {
                delete this.objectsByUUID[uuid];
            }
            const parentID = objct.ParentID;
            if (this.objectsByParent[parentID]) {
                const ind = this.objectsByParent[parentID].indexOf(objectID);
                if (ind !== -1) {
                    this.objectsByParent[parentID].splice(ind, 1);
                }
            }
            delete this.objects[objectID];
        }
    }
    readExtraParams(buf, pos, o) {
        if (pos >= buf.length) {
            return 0;
        }
        const extraParamCount = buf.readUInt8(pos++);
        for (let k = 0; k < extraParamCount; k++) {
            const type = buf.readUInt16LE(pos);
            pos = pos + 2;
            const paramLength = buf.readUInt32LE(pos);
            pos = pos + 4;
            pos += paramLength;
        }
        return pos;
    }
    getObjectsByParent(parentID) {
        const list = this.objectsByParent[parentID];
        if (list === undefined) {
            return [];
        }
        const result = [];
        list.forEach((localID) => {
            result.push(this.objects[localID]);
        });
        return result;
    }
    parseNameValues(str) {
        const nv = {};
        const lines = str.split('\n');
        lines.forEach((line) => {
            if (line.length > 0) {
                let kv = line.split(/[\t ]/);
                if (kv.length > 5) {
                    for (let x = 5; x < kv.length; x++) {
                        kv[4] += ' ' + kv[x];
                    }
                    kv = kv.slice(0, 5);
                }
                if (kv.length === 5) {
                    const namevalue = new NameValue_1.NameValue();
                    namevalue.type = kv[1];
                    namevalue.class = kv[2];
                    namevalue.sendTo = kv[3];
                    namevalue.value = kv[4];
                    nv[kv[0]] = namevalue;
                }
                else {
                    console.log('namevalue unexpected length: ' + kv.length);
                    console.log(kv);
                }
            }
        });
        return nv;
    }
    shutdown() {
        this.objects = {};
        this.objectsByUUID = {};
        this.objectsByParent = {};
    }
}
exports.ObjectStoreFull = ObjectStoreFull;
//# sourceMappingURL=ObjectStoreFull.js.map