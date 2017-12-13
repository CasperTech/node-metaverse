"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SetGroupContributionPacket {
    constructor() {
        this.name = 'SetGroupContribution';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902129;
    }
    getSize() {
        return 52;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.Data['Contribution'], pos);
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
            GroupID: UUID_1.UUID.zero(),
            Contribution: 0
        };
        newObjData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['Contribution'] = buf.readInt32LE(pos);
        pos += 4;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.SetGroupContributionPacket = SetGroupContributionPacket;
//# sourceMappingURL=SetGroupContribution.js.map