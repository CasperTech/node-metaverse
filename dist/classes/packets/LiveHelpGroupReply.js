"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class LiveHelpGroupReplyPacket {
    constructor() {
        this.name = 'LiveHelpGroupReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902140;
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
        buf.write(this.ReplyData['Selection'], pos);
        pos += this.ReplyData['Selection'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjReplyData = {
            RequestID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero(),
            Selection: ''
        };
        newObjReplyData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjReplyData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjReplyData['Selection'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ReplyData = newObjReplyData;
        return pos - startPos;
    }
}
exports.LiveHelpGroupReplyPacket = LiveHelpGroupReplyPacket;
//# sourceMappingURL=LiveHelpGroupReply.js.map