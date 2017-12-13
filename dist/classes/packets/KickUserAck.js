"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class KickUserAckPacket {
    constructor() {
        this.name = 'KickUserAck';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901924;
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
exports.KickUserAckPacket = KickUserAckPacket;
//# sourceMappingURL=KickUserAck.js.map