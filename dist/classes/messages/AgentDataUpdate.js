"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AgentDataUpdateMessage {
    constructor() {
        this.name = 'AgentDataUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AgentDataUpdate;
    }
    getSize() {
        return (this.AgentData['FirstName'].length + 1 + this.AgentData['LastName'].length + 1 + this.AgentData['GroupTitle'].length + 1 + this.AgentData['GroupName'].length + 1) + 40;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.AgentData['FirstName'].length, pos++);
        this.AgentData['FirstName'].copy(buf, pos);
        pos += this.AgentData['FirstName'].length;
        buf.writeUInt8(this.AgentData['LastName'].length, pos++);
        this.AgentData['LastName'].copy(buf, pos);
        pos += this.AgentData['LastName'].length;
        buf.writeUInt8(this.AgentData['GroupTitle'].length, pos++);
        this.AgentData['GroupTitle'].copy(buf, pos);
        pos += this.AgentData['GroupTitle'].length;
        this.AgentData['ActiveGroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.AgentData['GroupPowers'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.AgentData['GroupPowers'].high, pos);
        pos += 4;
        buf.writeUInt8(this.AgentData['GroupName'].length, pos++);
        this.AgentData['GroupName'].copy(buf, pos);
        pos += this.AgentData['GroupName'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            FirstName: Buffer.allocUnsafe(0),
            LastName: Buffer.allocUnsafe(0),
            GroupTitle: Buffer.allocUnsafe(0),
            ActiveGroupID: UUID_1.UUID.zero(),
            GroupPowers: Long.ZERO,
            GroupName: Buffer.allocUnsafe(0)
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['FirstName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['LastName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['GroupTitle'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjAgentData['ActiveGroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupPowers'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['GroupName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.AgentData = newObjAgentData;
        return pos - startPos;
    }
}
exports.AgentDataUpdateMessage = AgentDataUpdateMessage;
//# sourceMappingURL=AgentDataUpdate.js.map