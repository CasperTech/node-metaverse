"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ScriptResetPacket {
    constructor() {
        this.name = 'ScriptReset';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902006;
    }
    getSize() {
        return 64;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Script['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Script['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
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
        const newObjScript = {
            ObjectID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero()
        };
        newObjScript['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjScript['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Script = newObjScript;
        return pos - startPos;
    }
}
exports.ScriptResetPacket = ScriptResetPacket;
//# sourceMappingURL=ScriptReset.js.map