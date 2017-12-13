"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GodKickUserMessage {
    constructor() {
        this.name = 'GodKickUser';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GodKickUser;
    }
    getSize() {
        return (this.UserInfo['Reason'].length + 2) + 52;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.UserInfo['GodID'].writeToBuffer(buf, pos);
        pos += 16;
        this.UserInfo['GodSessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.UserInfo['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.UserInfo['KickFlags'], pos);
        pos += 4;
        buf.writeUInt16LE(this.UserInfo['Reason'].length, pos);
        pos += 2;
        this.UserInfo['Reason'].copy(buf, pos);
        pos += this.UserInfo['Reason'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjUserInfo = {
            GodID: UUID_1.UUID.zero(),
            GodSessionID: UUID_1.UUID.zero(),
            AgentID: UUID_1.UUID.zero(),
            KickFlags: 0,
            Reason: Buffer.allocUnsafe(0)
        };
        newObjUserInfo['GodID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjUserInfo['GodSessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjUserInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjUserInfo['KickFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjUserInfo['Reason'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.UserInfo = newObjUserInfo;
        return pos - startPos;
    }
}
exports.GodKickUserMessage = GodKickUserMessage;
//# sourceMappingURL=GodKickUser.js.map