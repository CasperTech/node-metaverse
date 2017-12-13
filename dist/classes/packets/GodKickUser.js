"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GodKickUserPacket {
    constructor() {
        this.name = 'GodKickUser';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901925;
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
        buf.write(this.UserInfo['Reason'], pos);
        pos += this.UserInfo['Reason'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjUserInfo = {
            GodID: UUID_1.UUID.zero(),
            GodSessionID: UUID_1.UUID.zero(),
            AgentID: UUID_1.UUID.zero(),
            KickFlags: 0,
            Reason: ''
        };
        newObjUserInfo['GodID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjUserInfo['GodSessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjUserInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjUserInfo['KickFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjUserInfo['Reason'] = buf.toString('utf8', pos, length);
        pos += length;
        this.UserInfo = newObjUserInfo;
        return pos - startPos;
    }
}
exports.GodKickUserPacket = GodKickUserPacket;
//# sourceMappingURL=GodKickUser.js.map