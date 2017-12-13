"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupAccountDetailsRequestPacket {
    constructor() {
        this.name = 'GroupAccountDetailsRequest';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902115;
    }
    getSize() {
        return 72;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        this.MoneyData['RequestID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.MoneyData['IntervalDays'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['CurrentInterval'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjMoneyData = {
            RequestID: UUID_1.UUID.zero(),
            IntervalDays: 0,
            CurrentInterval: 0
        };
        newObjMoneyData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMoneyData['IntervalDays'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['CurrentInterval'] = buf.readInt32LE(pos);
        pos += 4;
        this.MoneyData = newObjMoneyData;
        return pos - startPos;
    }
}
exports.GroupAccountDetailsRequestPacket = GroupAccountDetailsRequestPacket;
//# sourceMappingURL=GroupAccountDetailsRequest.js.map