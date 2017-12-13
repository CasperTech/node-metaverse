"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class StartGroupProposalPacket {
    constructor() {
        this.name = 'StartGroupProposal';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902123;
    }
    getSize() {
        return (this.ProposalData['ProposalText'].length + 1) + 60;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ProposalData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.ProposalData['Quorum'], pos);
        pos += 4;
        buf.writeFloatLE(this.ProposalData['Majority'], pos);
        pos += 4;
        buf.writeInt32LE(this.ProposalData['Duration'], pos);
        pos += 4;
        buf.write(this.ProposalData['ProposalText'], pos);
        pos += this.ProposalData['ProposalText'].length;
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
        const newObjProposalData = {
            GroupID: UUID_1.UUID.zero(),
            Quorum: 0,
            Majority: 0,
            Duration: 0,
            ProposalText: ''
        };
        newObjProposalData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjProposalData['Quorum'] = buf.readInt32LE(pos);
        pos += 4;
        newObjProposalData['Majority'] = buf.readFloatLE(pos);
        pos += 4;
        newObjProposalData['Duration'] = buf.readInt32LE(pos);
        pos += 4;
        newObjProposalData['ProposalText'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ProposalData = newObjProposalData;
        return pos - startPos;
    }
}
exports.StartGroupProposalPacket = StartGroupProposalPacket;
//# sourceMappingURL=StartGroupProposal.js.map