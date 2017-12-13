"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class KickUserAckMessage {
    constructor() {
        this.name = 'KickUserAck';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.KickUserAck;
    }
    getSize() {
        return 20;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.UserInfo['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.UserInfo['Flags'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjUserInfo = {
            SessionID: UUID_1.UUID.zero(),
            Flags: 0
        };
        newObjUserInfo['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjUserInfo['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.UserInfo = newObjUserInfo;
        return pos - startPos;
    }
}
exports.KickUserAckMessage = KickUserAckMessage;
//# sourceMappingURL=KickUserAck.js.map