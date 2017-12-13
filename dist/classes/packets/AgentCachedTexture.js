"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AgentCachedTexturePacket {
    constructor() {
        this.name = 'AgentCachedTexture';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902144;
    }
    getSize() {
        return ((17) * this.WearableData.length) + 37;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.AgentData['SerialNum'], pos);
        pos += 4;
        const count = this.WearableData.length;
        buf.writeUInt8(this.WearableData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.WearableData[i]['ID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.WearableData[i]['TextureIndex'], pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            SerialNum: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SerialNum'] = buf.readInt32LE(pos);
        pos += 4;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.WearableData = [];
        for (let i = 0; i < count; i++) {
            const newObjWearableData = {
                ID: UUID_1.UUID.zero(),
                TextureIndex: 0
            };
            newObjWearableData['ID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjWearableData['TextureIndex'] = buf.readUInt8(pos++);
            this.WearableData.push(newObjWearableData);
        }
        return pos - startPos;
    }
}
exports.AgentCachedTexturePacket = AgentCachedTexturePacket;
//# sourceMappingURL=AgentCachedTexture.js.map