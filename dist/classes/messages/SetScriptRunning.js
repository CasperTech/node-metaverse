"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SetScriptRunningMessage {
    constructor() {
        this.name = 'SetScriptRunning';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SetScriptRunning;
    }
    getSize() {
        return 65;
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
        buf.writeUInt8((this.Script['Running']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
            ItemID: UUID_1.UUID.zero(),
            Running: false
        };
        newObjScript['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjScript['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjScript['Running'] = (buf.readUInt8(pos++) === 1);
        this.Script = newObjScript;
        return pos - startPos;
    }
}
exports.SetScriptRunningMessage = SetScriptRunningMessage;
//# sourceMappingURL=SetScriptRunning.js.map