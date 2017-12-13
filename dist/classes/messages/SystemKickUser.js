"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SystemKickUserMessage {
    constructor() {
        this.name = 'SystemKickUser';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SystemKickUser;
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
        let varLength = 0;
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
exports.SystemKickUserMessage = SystemKickUserMessage;
//# sourceMappingURL=SystemKickUser.js.map