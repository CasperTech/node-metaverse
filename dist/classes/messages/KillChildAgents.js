"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class KillChildAgentsMessage {
    constructor() {
        this.name = 'KillChildAgents';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.KillChildAgents;
    }
    getSize() {
        return 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.IDBlock['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjIDBlock = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjIDBlock['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.IDBlock = newObjIDBlock;
        return pos - startPos;
    }
}
exports.KillChildAgentsMessage = KillChildAgentsMessage;
//# sourceMappingURL=KillChildAgents.js.map