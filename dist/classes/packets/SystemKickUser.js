"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SystemKickUserPacket {
    constructor() {
        this.name = 'SystemKickUser';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901926;
    }
    getSize() {
        return ((16) * this.AgentInfo.length) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = this.AgentInfo.length;
        buf.writeUInt8(this.AgentInfo.length, pos++);
        for (let i = 0; i < count; i++) {
            this.AgentInfo[i]['AgentID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const count = buf.readUInt8(pos++);
        this.AgentInfo = [];
        for (let i = 0; i < count; i++) {
            const newObjAgentInfo = {
                AgentID: UUID_1.UUID.zero()
            };
            newObjAgentInfo['AgentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.AgentInfo.push(newObjAgentInfo);
        }
        return pos - startPos;
    }
}
exports.SystemKickUserPacket = SystemKickUserPacket;
//# sourceMappingURL=SystemKickUser.js.map