"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DeRezObjectPacket {
    constructor() {
        this.name = 'DeRezObject';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902051;
    }
    getSize() {
        return ((4) * this.ObjectData.length) + 84;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentBlock['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.AgentBlock['Destination'], pos++);
        this.AgentBlock['DestinationID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentBlock['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.AgentBlock['PacketCount'], pos++);
        buf.writeUInt8(this.AgentBlock['PacketNumber'], pos++);
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.ObjectData[i]['ObjectLocalID'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjAgentBlock = {
            GroupID: UUID_1.UUID.zero(),
            Destination: 0,
            DestinationID: UUID_1.UUID.zero(),
            TransactionID: UUID_1.UUID.zero(),
            PacketCount: 0,
            PacketNumber: 0
        };
        newObjAgentBlock['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentBlock['Destination'] = buf.readUInt8(pos++);
        newObjAgentBlock['DestinationID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentBlock['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentBlock['PacketCount'] = buf.readUInt8(pos++);
        newObjAgentBlock['PacketNumber'] = buf.readUInt8(pos++);
        this.AgentBlock = newObjAgentBlock;
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++) {
            const newObjObjectData = {
                ObjectLocalID: 0
            };
            newObjObjectData['ObjectLocalID'] = buf.readUInt32LE(pos);
            pos += 4;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.DeRezObjectPacket = DeRezObjectPacket;
//# sourceMappingURL=DeRezObject.js.map