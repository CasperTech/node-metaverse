"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class DirClassifiedQueryBackendMessage {
    constructor() {
        this.name = 'DirClassifiedQueryBackend';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.DirClassifiedQueryBackend;
    }
    getSize() {
        return (this.QueryData['QueryText'].length + 1) + 49;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.QueryData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.QueryData['QueryText'].length, pos++);
        this.QueryData['QueryText'].copy(buf, pos);
        pos += this.QueryData['QueryText'].length;
        buf.writeUInt32LE(this.QueryData['QueryFlags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.QueryData['Category'], pos);
        pos += 4;
        buf.writeUInt32LE(this.QueryData['EstateID'], pos);
        pos += 4;
        buf.writeUInt8((this.QueryData['Godlike']) ? 1 : 0, pos++);
        buf.writeInt32LE(this.QueryData['QueryStart'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjQueryData = {
            QueryID: UUID_1.UUID.zero(),
            QueryText: Buffer.allocUnsafe(0),
            QueryFlags: 0,
            Category: 0,
            EstateID: 0,
            Godlike: false,
            QueryStart: 0
        };
        newObjQueryData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjQueryData['QueryText'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjQueryData['QueryFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjQueryData['Category'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjQueryData['EstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjQueryData['Godlike'] = (buf.readUInt8(pos++) === 1);
        newObjQueryData['QueryStart'] = buf.readInt32LE(pos);
        pos += 4;
        this.QueryData = newObjQueryData;
        return pos - startPos;
    }
}
exports.DirClassifiedQueryBackendMessage = DirClassifiedQueryBackendMessage;
//# sourceMappingURL=DirClassifiedQueryBackend.js.map