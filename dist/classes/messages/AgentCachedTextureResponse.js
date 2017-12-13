"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AgentCachedTextureResponseMessage {
    constructor() {
        this.name = 'AgentCachedTextureResponse';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AgentCachedTextureResponse;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.WearableData, 'HostName', 1) + 17) * this.WearableData.length) + 37;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
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
            this.WearableData[i]['TextureID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.WearableData[i]['TextureIndex'], pos++);
            buf.writeUInt8(this.WearableData[i]['HostName'].length, pos++);
            this.WearableData[i]['HostName'].copy(buf, pos);
            pos += this.WearableData[i]['HostName'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
                TextureID: UUID_1.UUID.zero(),
                TextureIndex: 0,
                HostName: Buffer.allocUnsafe(0)
            };
            newObjWearableData['TextureID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjWearableData['TextureIndex'] = buf.readUInt8(pos++);
            varLength = buf.readUInt8(pos++);
            newObjWearableData['HostName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.WearableData.push(newObjWearableData);
        }
        return pos - startPos;
    }
}
exports.AgentCachedTextureResponseMessage = AgentCachedTextureResponseMessage;
//# sourceMappingURL=AgentCachedTextureResponse.js.map