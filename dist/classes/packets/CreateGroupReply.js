"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class CreateGroupReplyPacket {
    constructor() {
        this.name = 'CreateGroupReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902100;
    }
    getSize() {
        return (this.ReplyData['Message'].length + 1) + 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ReplyData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.ReplyData['Success']) ? 1 : 0, pos++);
        buf.write(this.ReplyData['Message'], pos);
        pos += this.ReplyData['Message'].length;
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
        const newObjReplyData = {
            GroupID: UUID_1.UUID.zero(),
            Success: false,
            Message: ''
        };
        newObjReplyData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjReplyData['Success'] = (buf.readUInt8(pos++) === 1);
        newObjReplyData['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ReplyData = newObjReplyData;
        return pos - startPos;
    }
}
exports.CreateGroupReplyPacket = CreateGroupReplyPacket;
//# sourceMappingURL=CreateGroupReply.js.map