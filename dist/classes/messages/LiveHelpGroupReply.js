"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class LiveHelpGroupReplyMessage {
    constructor() {
        this.name = 'LiveHelpGroupReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.LiveHelpGroupReply;
    }
    getSize() {
        return (this.ReplyData['Selection'].length + 1) + 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.ReplyData['RequestID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ReplyData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ReplyData['Selection'].length, pos++);
        this.ReplyData['Selection'].copy(buf, pos);
        pos += this.ReplyData['Selection'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjReplyData = {
            RequestID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero(),
            Selection: Buffer.allocUnsafe(0)
        };
        newObjReplyData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjReplyData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjReplyData['Selection'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ReplyData = newObjReplyData;
        return pos - startPos;
    }
}
exports.LiveHelpGroupReplyMessage = LiveHelpGroupReplyMessage;
//# sourceMappingURL=LiveHelpGroupReply.js.map