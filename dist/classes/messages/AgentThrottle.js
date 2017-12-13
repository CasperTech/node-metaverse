"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AgentThrottleMessage {
    constructor() {
        this.name = 'AgentThrottle';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AgentThrottle;
    }
    getSize() {
        return (this.Throttle['Throttles'].length + 1) + 40;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['CircuitCode'], pos);
        pos += 4;
        buf.writeUInt32LE(this.Throttle['GenCounter'], pos);
        pos += 4;
        buf.writeUInt8(this.Throttle['Throttles'].length, pos++);
        this.Throttle['Throttles'].copy(buf, pos);
        pos += this.Throttle['Throttles'].length;
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
        const newObjThrottle = {
            GenCounter: 0,
            Throttles: Buffer.allocUnsafe(0)
        };
        newObjThrottle['GenCounter'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjThrottle['Throttles'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.Throttle = newObjThrottle;
        return pos - startPos;
    }
}
exports.AgentThrottleMessage = AgentThrottleMessage;
//# sourceMappingURL=AgentThrottle.js.map