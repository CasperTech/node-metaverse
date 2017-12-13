"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AgentFOVMessage {
    constructor() {
        this.name = 'AgentFOV';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AgentFOV;
    }
    getSize() {
        return 44;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['CircuitCode'], pos);
        pos += 4;
        buf.writeUInt32LE(this.FOVBlock['GenCounter'], pos);
        pos += 4;
        buf.writeFloatLE(this.FOVBlock['VerticalAngle'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            CircuitCode: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['CircuitCode'] = buf.readUInt32LE(pos);
        pos += 4;
        this.AgentData = newObjAgentData;
        const newObjFOVBlock = {
            GenCounter: 0,
            VerticalAngle: 0
        };
        newObjFOVBlock['GenCounter'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjFOVBlock['VerticalAngle'] = buf.readFloatLE(pos);
        pos += 4;
        this.FOVBlock = newObjFOVBlock;
        return pos - startPos;
    }
}
exports.AgentFOVMessage = AgentFOVMessage;
//# sourceMappingURL=AgentFOV.js.map