"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RegionIDAndHandleReplyMessage {
    constructor() {
        this.name = 'RegionIDAndHandleReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RegionIDAndHandleReply;
    }
    getSize() {
        return 24;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.ReplyBlock['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.ReplyBlock['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.ReplyBlock['RegionHandle'].high, pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjReplyBlock = {
            RegionID: UUID_1.UUID.zero(),
            RegionHandle: Long.ZERO
        };
        newObjReplyBlock['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjReplyBlock['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        this.ReplyBlock = newObjReplyBlock;
        return pos - startPos;
    }
}
exports.RegionIDAndHandleReplyMessage = RegionIDAndHandleReplyMessage;
//# sourceMappingURL=RegionIDAndHandleReply.js.map