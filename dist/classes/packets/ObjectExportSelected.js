"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ObjectExportSelectedPacket {
    constructor() {
        this.name = 'ObjectExportSelected';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901883;
    }
    getSize() {
        return ((16) * this.ObjectData.length) + 35;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['RequestID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt16LE(this.AgentData['VolumeDetail'], pos);
        pos += 2;
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ObjectData[i]['ObjectID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            RequestID: UUID_1.UUID.zero(),
            VolumeDetail: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['VolumeDetail'] = buf.readInt16LE(pos);
        pos += 2;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++) {
            const newObjObjectData = {
                ObjectID: UUID_1.UUID.zero()
            };
            newObjObjectData['ObjectID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.ObjectExportSelectedPacket = ObjectExportSelectedPacket;
//# sourceMappingURL=ObjectExportSelected.js.map