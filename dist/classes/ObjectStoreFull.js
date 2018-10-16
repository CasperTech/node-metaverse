"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../enums/Message");
const RequestMultipleObjects_1 = require("./messages/RequestMultipleObjects");
const UUID_1 = require("./UUID");
const Quaternion_1 = require("./Quaternion");
const Vector3_1 = require("./Vector3");
const Utils_1 = require("./Utils");
const PCode_1 = require("../enums/PCode");
const NameValue_1 = require("./NameValue");
const GameObjectFull_1 = require("./GameObjectFull");
const __1 = require("..");
const dist_1 = require("rbush-3d/dist");
const Vector4_1 = require("./Vector4");
const TextureEntry_1 = require("./TextureEntry");
const Color4_1 = require("./Color4");
const ParticleSystem_1 = require("./ParticleSystem");
class ObjectStoreFull {
    constructor(circuit, agent, clientEvents, options) {
        this.objects = {};
        this.objectsByUUID = {};
        this.objectsByParent = {};
        agent.localID = 0;
        this.rtree = new dist_1.RBush3D();
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
                    for (const objData of objectUpdate.ObjectData) {
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
                        const data = objData.ObjectData;
                        let dataPos = 0;
                        switch (data.length) {
                            case 76:
                                obj.CollisionPlane = new Vector4_1.Vector4(objData.ObjectData, dataPos);
                                dataPos += 16;
                            case 60:
                                obj.Position = new Vector3_1.Vector3(objData.ObjectData, dataPos);
                                dataPos += 12;
                                obj.Velocity = new Vector3_1.Vector3(objData.ObjectData, dataPos);
                                dataPos += 12;
                                obj.Acceleration = new Vector3_1.Vector3(objData.ObjectData, dataPos);
                                dataPos += 12;
                                obj.Rotation = new Quaternion_1.Quaternion(objData.ObjectData, dataPos);
                                dataPos += 12;
                                obj.AngularVelocity = new Vector3_1.Vector3(objData.ObjectData, dataPos);
                                dataPos += 12;
                                break;
                            case 48:
                                obj.CollisionPlane = new Vector4_1.Vector4(objData.ObjectData, dataPos);
                                dataPos += 16;
                            case 32:
                                obj.Position = new Vector3_1.Vector3([
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos), -0.5 * 256.0, 1.5 * 256.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 2), -0.5 * 256.0, 1.5 * 256.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -256.0, 3.0 * 256.0)
                                ]);
                                dataPos += 6;
                                obj.Velocity = new Vector3_1.Vector3([
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos), -256.0, 256.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 2), -256.0, 256.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -256.0, 256.0)
                                ]);
                                dataPos += 6;
                                obj.Acceleration = new Vector3_1.Vector3([
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos), -256.0, 256.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 2), -256.0, 256.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -256.0, 256.0)
                                ]);
                                dataPos += 6;
                                obj.Rotation = new Quaternion_1.Quaternion([
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos), -1.0, 1.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 2), -1.0, 1.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -1.0, 1.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -1.0, 1.0)
                                ]);
                                dataPos += 8;
                                obj.AngularVelocity = new Vector3_1.Vector3([
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos), -256.0, 256.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 2), -256.0, 256.0),
                                    Utils_1.Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -256.0, 256.0)
                                ]);
                                dataPos += 6;
                                break;
                            case 16:
                                obj.Position = new Vector3_1.Vector3([
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0)
                                ]);
                                obj.Velocity = new Vector3_1.Vector3([
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0)
                                ]);
                                obj.Acceleration = new Vector3_1.Vector3([
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0)
                                ]);
                                obj.Rotation = new Quaternion_1.Quaternion([
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -1.0, 1.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -1.0, 1.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -1.0, 1.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -1.0, 1.0)
                                ]);
                                obj.AngularVelocity = new Vector3_1.Vector3([
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                                    Utils_1.Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0)
                                ]);
                                break;
                        }
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
                        obj.TextureEntry = new TextureEntry_1.TextureEntry(objData.TextureEntry);
                        obj.TextureAnim = objData.TextureAnim;
                        const pcodeData = objData.Data;
                        obj.Text = Utils_1.Utils.BufferToStringSimple(objData.Text);
                        obj.TextColor = new Color4_1.Color4(objData.TextColor, 0, false, true);
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
                        switch (obj.PCode) {
                            case PCode_1.PCode.Grass:
                            case PCode_1.PCode.Tree:
                            case PCode_1.PCode.NewTree:
                                if (pcodeData.length === 1) {
                                    obj.TreeSpecies = pcodeData[0];
                                }
                                break;
                        }
                        if (this.objects[localID].PCode === PCode_1.PCode.Avatar && this.objects[localID].FullID.toString() === this.agent.agentID.toString()) {
                            this.agent.localID = localID;
                            if (this.options & __1.BotOptionFlags.StoreMyAttachmentsOnly) {
                                Object.keys(this.objectsByParent).forEach((objParentID) => {
                                    const parent = parseInt(objParentID, 10);
                                    if (parent !== this.agent.localID) {
                                        let foundAvatars = false;
                                        this.objectsByParent[parent].forEach((objID) => {
                                            if (this.objects[objID]) {
                                                const o = this.objects[objID];
                                                if (o.PCode === PCode_1.PCode.Avatar) {
                                                    foundAvatars = true;
                                                }
                                            }
                                        });
                                        if (this.objects[parent]) {
                                            const o = this.objects[parent];
                                            if (o.PCode === PCode_1.PCode.Avatar) {
                                                foundAvatars = true;
                                            }
                                        }
                                        if (!foundAvatars) {
                                            this.deleteObject(parent);
                                        }
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
                        if (objData.PCode !== PCode_1.PCode.Avatar && this.options & __1.BotOptionFlags.StoreMyAttachmentsOnly && (this.agent.localID !== 0 && obj.ParentID !== this.agent.localID)) {
                            this.deleteObject(localID);
                        }
                        else {
                            this.insertIntoRtree(obj);
                        }
                    }
                    break;
                case Message_1.Message.ObjectUpdateCached:
                    {
                        const objectUpdateCached = packet.message;
                        const rmo = new RequestMultipleObjects_1.RequestMultipleObjectsMessage();
                        rmo.AgentData = {
                            AgentID: this.agent.agentID,
                            SessionID: this.circuit.sessionID
                        };
                        rmo.ObjectData = [];
                        for (const obj of objectUpdateCached.ObjectData) {
                            if (!this.objects[obj.ID]) {
                                rmo.ObjectData.push({
                                    CacheMissType: 0,
                                    ID: obj.ID
                                });
                            }
                        }
                        if (rmo.ObjectData.length > 0) {
                            circuit.sendMessage(rmo, 0);
                        }
                        break;
                    }
                case Message_1.Message.ObjectUpdateCompressed:
                    {
                        const objectUpdateCompressed = packet.message;
                        for (const obj of objectUpdateCompressed.ObjectData) {
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
                            if (compressedflags & __1.CompressedFlags.HasAngularVelocity) {
                                o.AngularVelocity = new Vector3_1.Vector3(buf, pos, false);
                                pos = pos + 12;
                            }
                            if (compressedflags & __1.CompressedFlags.HasParent) {
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
                            if (pcode !== PCode_1.PCode.Avatar && newObj && this.options & __1.BotOptionFlags.StoreMyAttachmentsOnly && (this.agent.localID !== 0 && o.ParentID !== this.agent.localID)) {
                                this.deleteObject(localID);
                                return;
                            }
                            else {
                                if (compressedflags & __1.CompressedFlags.Tree) {
                                    o.TreeSpecies = buf.readUInt8(pos++);
                                }
                                else if (compressedflags & __1.CompressedFlags.ScratchPad) {
                                    o.TreeSpecies = 0;
                                    const scratchPadSize = buf.readUInt8(pos++);
                                    pos = pos + scratchPadSize;
                                }
                                if (compressedflags & __1.CompressedFlags.HasText) {
                                    const result = Utils_1.Utils.BufferToString(buf, pos);
                                    pos += result.readLength;
                                    o.Text = result.result;
                                    o.TextColor = new Color4_1.Color4(buf, pos, false, true);
                                    pos = pos + 4;
                                }
                                else {
                                    o.Text = '';
                                }
                                if (compressedflags & __1.CompressedFlags.MediaURL) {
                                    const result = Utils_1.Utils.BufferToString(buf, pos);
                                    pos += result.readLength;
                                    o.MediaURL = result.result;
                                }
                                if (compressedflags & __1.CompressedFlags.HasParticles) {
                                    o.Particles = new ParticleSystem_1.ParticleSystem(buf.slice(pos, pos + 86), 0);
                                    pos += 86;
                                }
                                pos = this.readExtraParams(buf, pos, o);
                                if (compressedflags & __1.CompressedFlags.HasSound) {
                                    o.Sound = new UUID_1.UUID(buf, pos);
                                    pos = pos + 16;
                                    o.SoundGain = buf.readFloatLE(pos);
                                    pos += 4;
                                    o.SoundFlags = buf.readUInt8(pos++);
                                    o.SoundRadius = buf.readFloatLE(pos);
                                    pos = pos + 4;
                                }
                                if (compressedflags & __1.CompressedFlags.HasNameValues) {
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
                                o.TextureEntry = new TextureEntry_1.TextureEntry(buf.slice(pos, pos + textureEntryLength));
                                pos = pos + textureEntryLength;
                                if (compressedflags & __1.CompressedFlags.TextureAnimation) {
                                    pos = pos + 4;
                                }
                                o.IsAttachment = (compressedflags & __1.CompressedFlags.HasNameValues) !== 0 && o.ParentID !== 0;
                                this.insertIntoRtree(o);
                            }
                        }
                        break;
                    }
                case Message_1.Message.ImprovedTerseObjectUpdate:
                    {
                        const objectUpdateTerse = packet.message;
                        const dilation = objectUpdateTerse.RegionData.TimeDilation / 65535.0;
                        for (let i = 0; i < objectUpdateTerse.ObjectData.length; i++) {
                            const objectData = objectUpdateTerse.ObjectData[i];
                            if (!(this.options & __1.BotOptionFlags.StoreMyAttachmentsOnly)) {
                                let pos = 0;
                                const localID = objectData.Data.readUInt32LE(pos);
                                pos = pos + 4;
                                if (this.objects[localID]) {
                                    this.objects[localID].State = objectData.Data.readUInt8(pos++);
                                    const avatar = (objectData.Data.readUInt8(pos++) !== 0);
                                    if (avatar) {
                                        this.objects[localID].CollisionPlane = new Vector4_1.Vector4(objectData.Data, pos);
                                        pos += 16;
                                    }
                                    this.objects[localID].Position = new Vector3_1.Vector3(objectData.Data, pos);
                                    pos += 12;
                                    this.objects[localID].Velocity = new Vector3_1.Vector3([
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -128.0, 128.0),
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -128.0, 128.0),
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -128.0, 128.0)
                                    ]);
                                    pos += 6;
                                    this.objects[localID].Acceleration = new Vector3_1.Vector3([
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -64.0, 64.0),
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -64.0, 64.0),
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -64.0, 64.0)
                                    ]);
                                    pos += 6;
                                    this.objects[localID].Rotation = new Quaternion_1.Quaternion([
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -1.0, 1.0),
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -1.0, 1.0),
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -1.0, 1.0),
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 6), -1.0, 1.0)
                                    ]);
                                    pos += 8;
                                    this.objects[localID].AngularVelocity = new Vector3_1.Vector3([
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -64.0, 64.0),
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -64.0, 64.0),
                                        Utils_1.Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -64.0, 64.0)
                                    ]);
                                    pos += 6;
                                    if (objectData.TextureEntry.length > 0) {
                                        this.objects[localID].TextureEntry = new TextureEntry_1.TextureEntry(objectData.TextureEntry.slice(4));
                                    }
                                    this.insertIntoRtree(this.objects[localID]);
                                }
                                else {
                                    console.log('Received terse update for object ' + localID + ' which is not in the store, so requesting the object');
                                    const rmo = new RequestMultipleObjects_1.RequestMultipleObjectsMessage();
                                    rmo.AgentData = {
                                        AgentID: this.agent.agentID,
                                        SessionID: this.circuit.sessionID
                                    };
                                    rmo.ObjectData = [];
                                    rmo.ObjectData.push({
                                        CacheMissType: 0,
                                        ID: localID
                                    });
                                    circuit.sendMessage(rmo, 0);
                                }
                            }
                        }
                        break;
                    }
                case Message_1.Message.MultipleObjectUpdate:
                    const multipleObjectUpdate = packet.message;
                    console.error('TODO: MultipleObjectUpdate');
                    break;
                case Message_1.Message.KillObject:
                    const killObj = packet.message;
                    for (const obj of killObj.ObjectData) {
                        const objectID = obj.ID;
                        this.deleteObject(objectID);
                    }
                    break;
            }
        });
    }
    insertIntoRtree(obj) {
        if (obj.rtreeEntry !== undefined) {
            this.rtree.remove(obj.rtreeEntry);
        }
        const normalizedScale = obj.Scale.multiplyByQuat(obj.Rotation);
        const bounds = {
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
            if (this.objects[objectID].rtreeEntry !== undefined) {
                this.rtree.remove(this.objects[objectID].rtreeEntry);
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
    getObjectByUUID(fullID) {
        if (fullID instanceof UUID_1.UUID) {
            fullID = fullID.toString();
        }
        if (!this.objectsByUUID[fullID]) {
            throw new Error('No object found with that UUID');
        }
        const localID = this.objectsByUUID[fullID];
        return this.objects[localID];
    }
    getObjectByLocalID(localID) {
        if (!this.objects[localID]) {
            throw new Error('No object found with that UUID');
        }
        return this.objects[localID];
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
        this.rtree.clear();
        this.objectsByUUID = {};
        this.objectsByParent = {};
    }
    findParent(go) {
        if (go.ParentID === 0) {
            return go;
        }
        else {
            return this.findParent(this.objects[go.ParentID]);
        }
    }
    getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ) {
        const result = this.rtree.search({
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY,
            minZ: minZ,
            maxZ: maxZ
        });
        const found = {};
        const objs = [];
        for (const obj of result) {
            const o = obj;
            const go = o.gameObject;
            try {
                const parent = this.findParent(go);
                const uuid = parent.FullID.toString();
                if (parent !== go) {
                    console.log('Resolved object ' + go.FullID.toString() + ' to parent ' + parent.FullID.toString() + ' which ' + ((found[uuid] === undefined) ? 'does not exist' : 'already exists'));
                }
                if (found[uuid] === undefined) {
                    found[uuid] = parent;
                    objs.push(parent);
                }
            }
            catch (error) {
                console.log('Failed to find parent for ' + go.FullID.toString());
                console.error(error);
            }
        }
        return objs;
    }
}
exports.ObjectStoreFull = ObjectStoreFull;
//# sourceMappingURL=ObjectStoreFull.js.map