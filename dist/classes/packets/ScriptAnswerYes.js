"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ScriptAnswerYesPacket {
    constructor() {
        this.name = 'ScriptAnswerYes';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901892;
    }
    getSize() {
        return 68;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['TaskID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.Data['Questions'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjData = {
            TaskID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero(),
            Questions: 0
        };
        newObjData['TaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['Questions'] = buf.readInt32LE(pos);
        pos += 4;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.ScriptAnswerYesPacket = ScriptAnswerYesPacket;
//# sourceMappingURL=ScriptAnswerYes.js.map