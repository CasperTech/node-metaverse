"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DirLandQueryPacket {
    constructor() {
        this.name = 'DirLandQuery';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901808;
    }
    getSize() {
        return 68;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.QueryData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.QueryData['QueryFlags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.QueryData['SearchType'], pos);
        pos += 4;
        buf.writeInt32LE(this.QueryData['Price'], pos);
        pos += 4;
        buf.writeInt32LE(this.QueryData['Area'], pos);
        pos += 4;
        buf.writeInt32LE(this.QueryData['QueryStart'], pos);
        pos += 4;
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
        const newObjQueryData = {
            QueryID: UUID_1.UUID.zero(),
            QueryFlags: 0,
            SearchType: 0,
            Price: 0,
            Area: 0,
            QueryStart: 0
        };
        newObjQueryData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjQueryData['QueryFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjQueryData['SearchType'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjQueryData['Price'] = buf.readInt32LE(pos);
        pos += 4;
        newObjQueryData['Area'] = buf.readInt32LE(pos);
        pos += 4;
        newObjQueryData['QueryStart'] = buf.readInt32LE(pos);
        pos += 4;
        this.QueryData = newObjQueryData;
        return pos - startPos;
    }
}
exports.DirLandQueryPacket = DirLandQueryPacket;
//# sourceMappingURL=DirLandQuery.js.map