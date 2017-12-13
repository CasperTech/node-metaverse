"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class KillChildAgentsPacket {
    constructor() {
        this.name = 'KillChildAgents';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902002;
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
        const newObjIDBlock = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjIDBlock['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.IDBlock = newObjIDBlock;
        return pos - startPos;
    }
}
exports.KillChildAgentsPacket = KillChildAgentsPacket;
//# sourceMappingURL=KillChildAgents.js.map