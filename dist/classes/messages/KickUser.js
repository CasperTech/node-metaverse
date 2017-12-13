"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class KickUserMessage {
    constructor() {
        this.name = 'KickUser';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.KickUser;
    }
    getSize() {
        return (this.UserInfo['Reason'].length + 2) + 38;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.TargetBlock['TargetIP'].writeToBuffer(buf, pos);
        pos += 4;
        buf.writeUInt16LE(this.TargetBlock['TargetPort'], pos);
        pos += 2;
        this.UserInfo['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.UserInfo['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt16LE(this.UserInfo['Reason'].length, pos);
        pos += 2;
        this.UserInfo['Reason'].copy(buf, pos);
        pos += this.UserInfo['Reason'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjTargetBlock = {
            TargetIP: IPAddress_1.IPAddress.zero(),
            TargetPort: 0
        };
        newObjTargetBlock['TargetIP'] = new IPAddress_1.IPAddress(buf, pos);
        pos += 4;
        newObjTargetBlock['TargetPort'] = buf.readUInt16LE(pos);
        pos += 2;
        this.TargetBlock = newObjTargetBlock;
        const newObjUserInfo = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            Reason: Buffer.allocUnsafe(0)
        };
        newObjUserInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjUserInfo['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjUserInfo['Reason'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.UserInfo = newObjUserInfo;
        return pos - startPos;
    }
}
exports.KickUserMessage = KickUserMessage;
//# sourceMappingURL=KickUser.js.map