"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../enums/Message");
const RequestMultipleObjects_1 = require("./messages/RequestMultipleObjects");
const UUID_1 = require("./UUID");
const Utils_1 = require("./Utils");
const PCode_1 = require("../enums/PCode");
const NameValue_1 = require("./NameValue");
const __1 = require("..");
const GameObject_1 = require("./GameObject");
class ObjectStoreLite {
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
                    this.objectUpdate(objectUpdate);
                    break;
                case Message_1.Message.ObjectUpdateCached:
                    const objectUpdateCached = packet.message;
                    this.objectUpdateCached(objectUpdateCached);
                    break;
                case Message_1.Message.ObjectUpdateCompressed:
                    {
                        const objectUpdateCompressed = packet.message;
                        this.objectUpdateCompressed(objectUpdateCompressed);
                        break;
                    }
                case Message_1.Message.ImprovedTerseObjectUpdate:
                    const objectUpdateTerse = packet.message;
                    this.objectUpdateTerse(objectUpdateTerse);
                    break;
                case Message_1.Message.MultipleObjectUpdate:
                    const multipleObjectUpdate = packet.message;
                    this.objectUpdateMultiple(multipleObjectUpdate);
                    break;
                case Message_1.Message.KillObject:
                    const killObj = packet.message;
                    this.killObject(killObj);
                    break;
            }
        });
    }
    objectUpdate(objectUpdate) {
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
                this.objects[localID] = new GameObject_1.GameObject();
            }
            const obj = this.objects[localID];
            obj.ID = objData.ID;
            obj.FullID = objData.FullID;
            obj.ParentID = objData.ParentID;
            obj.OwnerID = objData.OwnerID;
            obj.PCode = objData.PCode;
            this.objects[localID].NameValue = this.parseNameValues(Utils_1.Utils.BufferToStringSimple(objData.NameValue));
            if (objData.PCode === PCode_1.PCode.Avatar && this.objects[localID].FullID.toString() === this.agent.agentID.toString()) {
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
            this.objectsByUUID[objData.FullID.toString()] = localID;
            if (!this.objectsByParent[parentID]) {
                this.objectsByParent[parentID] = [];
            }
            if (addToParentList) {
                this.objectsByParent[parentID].push(localID);
            }
            if (objData.PCode !== PCode_1.PCode.Avatar && this.options & __1.BotOptionFlags.StoreMyAttachmentsOnly) {
                if (this.agent.localID !== 0 && obj.ParentID !== this.agent.localID) {
                    this.deleteObject(localID);
                    return;
                }
            }
        });
    }
    objectUpdateCached(objectUpdateCached) {
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
        this.circuit.sendMessage(rmo, 0);
    }
    objectUpdateCompressed(objectUpdateCompressed) {
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
                this.objects[localID] = new GameObject_1.GameObject();
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
            const compressedflags = buf.readUInt32LE(pos);
            pos = pos + 4;
            o.OwnerID = new UUID_1.UUID(buf, pos);
            pos += 16;
            if (compressedflags & __1.CompressedFlags.HasAngularVelocity) {
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
            if (pcode !== PCode_1.PCode.Avatar && newObj && this.options & __1.BotOptionFlags.StoreMyAttachmentsOnly) {
                if (this.agent.localID !== 0 && o.ParentID !== this.agent.localID) {
                    this.deleteObject(localID);
                    return;
                }
            }
            if (compressedflags & __1.CompressedFlags.Tree) {
                pos++;
            }
            else if (compressedflags & __1.CompressedFlags.ScratchPad) {
                const scratchPadSize = buf.readUInt8(pos++);
                pos = pos + scratchPadSize;
            }
            if (compressedflags & __1.CompressedFlags.HasText) {
                const result = Utils_1.Utils.BufferToString(buf, pos);
                pos += result.readLength;
                pos = pos + 4;
            }
            if (compressedflags & __1.CompressedFlags.MediaURL) {
                const result = Utils_1.Utils.BufferToString(buf, pos);
                pos += result.readLength;
            }
            if (compressedflags & __1.CompressedFlags.HasParticles) {
                pos += 86;
            }
            pos = this.readExtraParams(buf, pos, o);
            if (compressedflags & __1.CompressedFlags.HasSound) {
                pos = pos + 16;
                pos += 4;
                pos++;
                pos = pos + 4;
            }
            if (compressedflags & __1.CompressedFlags.HasNameValues) {
                const result = Utils_1.Utils.BufferToString(buf, pos);
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
            pos = pos + textureEntryLength;
            if (compressedflags & __1.CompressedFlags.TextureAnimation) {
                pos = pos + 4;
            }
            o.IsAttachment = (compressedflags & __1.CompressedFlags.HasNameValues) !== 0 && o.ParentID !== 0;
        }
    }
    objectUpdateTerse(objectUpdateTerse) { }
    objectUpdateMultiple(objectUpdateMultiple) { }
    killObject(killObj) {
        killObj.ObjectData.forEach((obj) => {
            const objectID = obj.ID;
            this.deleteObject(objectID);
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
            if (this.rtree && this.objects[objectID].rtreeEntry !== undefined) {
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
        if (this.rtree) {
            this.rtree.clear();
        }
        this.objectsByUUID = {};
        this.objectsByParent = {};
    }
    findParent(go) {
        if (go.ParentID !== 0 && this.objects[go.ParentID]) {
            return this.findParent(this.objects[go.ParentID]);
        }
        else {
            return go;
        }
    }
    populateChildren(obj) {
        obj.children = [];
        obj.totalChildren = 0;
        for (const child of this.getObjectsByParent(obj.ID)) {
            obj.totalChildren++;
            this.populateChildren(child);
            if (child.totalChildren !== undefined) {
                obj.totalChildren += child.totalChildren;
            }
            obj.children.push(child);
        }
    }
    getAllObjects() {
        const results = [];
        const found = {};
        for (const k of Object.keys(this.objects)) {
            const go = this.objects[parseInt(k, 10)];
            if (go.PCode !== PCode_1.PCode.Avatar && (go.IsAttachment === undefined || go.IsAttachment === false)) {
                try {
                    const parent = this.findParent(go);
                    if (parent.PCode !== PCode_1.PCode.Avatar && (parent.IsAttachment === undefined || parent.IsAttachment === false)) {
                        const uuid = parent.FullID.toString();
                        if (found[uuid] === undefined) {
                            found[uuid] = parent;
                            results.push(parent);
                        }
                    }
                }
                catch (error) {
                    console.log('Failed to find parent for ' + go.FullID.toString());
                    console.error(error);
                }
            }
        }
        for (const obj of results) {
            this.populateChildren(obj);
        }
        return results;
    }
    getNumberOfObjects() {
        return Object.keys(this.objects).length;
    }
    getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ) {
        if (!this.rtree) {
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
        const found = {};
        const objs = [];
        for (const obj of result) {
            const o = obj;
            const go = o.gameObject;
            if (go.PCode !== PCode_1.PCode.Avatar && (go.IsAttachment === undefined || go.IsAttachment === false)) {
                try {
                    const parent = this.findParent(go);
                    if (parent.PCode !== PCode_1.PCode.Avatar && (parent.IsAttachment === undefined || parent.IsAttachment === false)) {
                        const uuid = parent.FullID.toString();
                        if (found[uuid] === undefined) {
                            found[uuid] = parent;
                            objs.push(parent);
                        }
                    }
                }
                catch (error) {
                    console.log('Failed to find parent for ' + go.FullID.toString());
                    console.error(error);
                }
            }
        }
        for (const obj of objs) {
            this.populateChildren(obj);
        }
        return objs;
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
    insertIntoRtree(obj) {
        if (!this.rtree) {
            return;
        }
        if (obj.rtreeEntry !== undefined) {
            this.rtree.remove(obj.rtreeEntry);
        }
        if (!obj.Scale || !obj.Position || !obj.Rotation) {
            return;
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
}
exports.ObjectStoreLite = ObjectStoreLite;
//# sourceMappingURL=ObjectStoreLite.js.map