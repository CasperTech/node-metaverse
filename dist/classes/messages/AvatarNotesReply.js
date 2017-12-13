"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AvatarNotesReplyMessage {
    constructor() {
        this.name = 'AvatarNotesReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AvatarNotesReply;
    }
    getSize() {
        return (this.Data['Notes'].length + 2) + 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['TargetID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt16LE(this.Data['Notes'].length, pos);
        pos += 2;
        this.Data['Notes'].copy(buf, pos);
        pos += this.Data['Notes'].length;
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
        const newObjData = {
            TargetID: UUID_1.UUID.zero(),
            Notes: Buffer.allocUnsafe(0)
        };
        newObjData['TargetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjData['Notes'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.AvatarNotesReplyMessage = AvatarNotesReplyMessage;
//# sourceMappingURL=AvatarNotesReply.js.map