"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class PlacesQueryPacket {
    constructor() {
        this.name = 'PlacesQuery';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901789;
    }
    getSize() {
        return (this.QueryData['QueryText'].length + 1 + this.QueryData['SimName'].length + 1) + 69;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        this.TransactionData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.QueryData['QueryText'], pos);
        pos += this.QueryData['QueryText'].length;
        buf.writeUInt32LE(this.QueryData['QueryFlags'], pos);
        pos += 4;
        buf.writeInt8(this.QueryData['Category'], pos++);
        buf.write(this.QueryData['SimName'], pos);
        pos += this.QueryData['SimName'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            QueryID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjTransactionData = {
            TransactionID: UUID_1.UUID.zero()
        };
        newObjTransactionData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.TransactionData = newObjTransactionData;
        const newObjQueryData = {
            QueryText: '',
            QueryFlags: 0,
            Category: 0,
            SimName: ''
        };
        newObjQueryData['QueryText'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjQueryData['QueryFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjQueryData['Category'] = buf.readInt8(pos++);
        newObjQueryData['SimName'] = buf.toString('utf8', pos, length);
        pos += length;
        this.QueryData = newObjQueryData;
        return pos - startPos;
    }
}
exports.PlacesQueryPacket = PlacesQueryPacket;
//# sourceMappingURL=PlacesQuery.js.map