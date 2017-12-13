"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ScriptRunningReplyMessage {
    constructor() {
        this.name = 'ScriptRunningReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ScriptRunningReply;
    }
    getSize() {
        return 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Script['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Script['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.Script['Running']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjScript = {
            ObjectID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero(),
            Running: false
        };
        newObjScript['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjScript['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjScript['Running'] = (buf.readUInt8(pos++) === 1);
        this.Script = newObjScript;
        return pos - startPos;
    }
}
exports.ScriptRunningReplyMessage = ScriptRunningReplyMessage;
//# sourceMappingURL=ScriptRunningReply.js.map