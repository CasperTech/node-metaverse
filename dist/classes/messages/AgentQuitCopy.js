"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AgentQuitCopyMessage {
    constructor() {
        this.name = 'AgentQuitCopy';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AgentQuitCopy;
    }
    getSize() {
        return 36;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.FuseBlock['ViewerCircuitCode'], pos);
        pos += 4;
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
        const newObjFuseBlock = {
            ViewerCircuitCode: 0
        };
        newObjFuseBlock['ViewerCircuitCode'] = buf.readUInt32LE(pos);
        pos += 4;
        this.FuseBlock = newObjFuseBlock;
        return pos - startPos;
    }
}
exports.AgentQuitCopyMessage = AgentQuitCopyMessage;
//# sourceMappingURL=AgentQuitCopy.js.map