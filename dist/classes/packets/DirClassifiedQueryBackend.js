"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DirClassifiedQueryBackendPacket {
    constructor() {
        this.name = 'DirClassifiedQueryBackend';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901800;
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
        buf.write(this.QueryData['QueryText'], pos);
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
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjQueryData = {
            QueryID: UUID_1.UUID.zero(),
            QueryText: '',
            QueryFlags: 0,
            Category: 0,
            EstateID: 0,
            Godlike: false,
            QueryStart: 0
        };
        newObjQueryData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjQueryData['QueryText'] = buf.toString('utf8', pos, length);
        pos += length;
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
exports.DirClassifiedQueryBackendPacket = DirClassifiedQueryBackendPacket;
//# sourceMappingURL=DirClassifiedQueryBackend.js.map