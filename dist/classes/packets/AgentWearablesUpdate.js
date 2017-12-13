"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AgentWearablesUpdatePacket {
    constructor() {
        this.name = 'AgentWearablesUpdate';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902142;
    }
    getSize() {
        return ((33) * this.WearableData.length) + 37;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['SerialNum'], pos);
        pos += 4;
        const count = this.WearableData.length;
        buf.writeUInt8(this.WearableData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.WearableData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            this.WearableData[i]['AssetID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.WearableData[i]['WearableType'], pos++);
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
        newObjAgentData['SerialNum'] = buf.readUInt32LE(pos);
        pos += 4;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.WearableData = [];
        for (let i = 0; i < count; i++) {
            const newObjWearableData = {
                ItemID: UUID_1.UUID.zero(),
                AssetID: UUID_1.UUID.zero(),
                WearableType: 0
            };
            newObjWearableData['ItemID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjWearableData['AssetID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjWearableData['WearableType'] = buf.readUInt8(pos++);
            this.WearableData.push(newObjWearableData);
        }
        return pos - startPos;
    }
}
exports.AgentWearablesUpdatePacket = AgentWearablesUpdatePacket;
//# sourceMappingURL=AgentWearablesUpdate.js.map