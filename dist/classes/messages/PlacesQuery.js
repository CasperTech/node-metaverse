"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class PlacesQueryMessage {
    constructor() {
        this.name = 'PlacesQuery';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.PlacesQuery;
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
        buf.writeUInt8(this.QueryData['QueryText'].length, pos++);
        this.QueryData['QueryText'].copy(buf, pos);
        pos += this.QueryData['QueryText'].length;
        buf.writeUInt32LE(this.QueryData['QueryFlags'], pos);
        pos += 4;
        buf.writeInt8(this.QueryData['Category'], pos++);
        buf.writeUInt8(this.QueryData['SimName'].length, pos++);
        this.QueryData['SimName'].copy(buf, pos);
        pos += this.QueryData['SimName'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
            QueryText: Buffer.allocUnsafe(0),
            QueryFlags: 0,
            Category: 0,
            SimName: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt8(pos++);
        newObjQueryData['QueryText'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjQueryData['QueryFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjQueryData['Category'] = buf.readInt8(pos++);
        varLength = buf.readUInt8(pos++);
        newObjQueryData['SimName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.QueryData = newObjQueryData;
        return pos - startPos;
    }
}
exports.PlacesQueryMessage = PlacesQueryMessage;
//# sourceMappingURL=PlacesQuery.js.map