"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class CreateGroupReplyMessage {
    constructor() {
        this.name = 'CreateGroupReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.CreateGroupReply;
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
        buf.writeUInt8(this.ReplyData['Message'].length, pos++);
        this.ReplyData['Message'].copy(buf, pos);
        pos += this.ReplyData['Message'].length;
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
        const newObjReplyData = {
            GroupID: UUID_1.UUID.zero(),
            Success: false,
            Message: Buffer.allocUnsafe(0)
        };
        newObjReplyData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjReplyData['Success'] = (buf.readUInt8(pos++) === 1);
        varLength = buf.readUInt8(pos++);
        newObjReplyData['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ReplyData = newObjReplyData;
        return pos - startPos;
    }
}
exports.CreateGroupReplyMessage = CreateGroupReplyMessage;
//# sourceMappingURL=CreateGroupReply.js.map