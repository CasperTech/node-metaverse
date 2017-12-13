"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AgentSetAppearancePacket {
    constructor() {
        this.name = 'AgentSetAppearance';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901844;
    }
    getSize() {
        return ((17) * this.WearableData.length) + (this.ObjectData['TextureEntry'].length + 2) + ((1) * this.VisualParam.length) + 50;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['SerialNum'], pos);
        pos += 4;
        this.AgentData['Size'].writeToBuffer(buf, pos, false);
        pos += 12;
        let count = this.WearableData.length;
        buf.writeUInt8(this.WearableData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.WearableData[i]['CacheID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.WearableData[i]['TextureIndex'], pos++);
        }
        buf.write(this.ObjectData['TextureEntry'], pos);
        pos += this.ObjectData['TextureEntry'].length;
        count = this.VisualParam.length;
        buf.writeUInt8(this.VisualParam.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.VisualParam[i]['ParamValue'], pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            SerialNum: 0,
            Size: Vector3_1.Vector3.getZero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SerialNum'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['Size'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        this.AgentData = newObjAgentData;
        let count = buf.readUInt8(pos++);
        this.WearableData = [];
        for (let i = 0; i < count; i++) {
            const newObjWearableData = {
                CacheID: UUID_1.UUID.zero(),
                TextureIndex: 0
            };
            newObjWearableData['CacheID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjWearableData['TextureIndex'] = buf.readUInt8(pos++);
            this.WearableData.push(newObjWearableData);
        }
        const newObjObjectData = {
            TextureEntry: ''
        };
        newObjObjectData['TextureEntry'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ObjectData = newObjObjectData;
        count = buf.readUInt8(pos++);
        this.VisualParam = [];
        for (let i = 0; i < count; i++) {
            const newObjVisualParam = {
                ParamValue: 0
            };
            newObjVisualParam['ParamValue'] = buf.readUInt8(pos++);
            this.VisualParam.push(newObjVisualParam);
        }
        return pos - startPos;
    }
}
exports.AgentSetAppearancePacket = AgentSetAppearancePacket;
//# sourceMappingURL=AgentSetAppearance.js.map