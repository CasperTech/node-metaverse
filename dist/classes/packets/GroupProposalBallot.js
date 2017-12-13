"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupProposalBallotPacket {
    constructor() {
        this.name = 'GroupProposalBallot';
        this.flags = MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902124;
    }
    getSize() {
        return (this.ProposalData['VoteCast'].length + 1) + 64;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ProposalData['ProposalID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ProposalData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.ProposalData['VoteCast'], pos);
        pos += this.ProposalData['VoteCast'].length;
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
            ProposalID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero(),
            VoteCast: ''
        };
        newObjProposalData['ProposalID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjProposalData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjProposalData['VoteCast'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ProposalData = newObjProposalData;
        return pos - startPos;
    }
}
exports.GroupProposalBallotPacket = GroupProposalBallotPacket;
//# sourceMappingURL=GroupProposalBallot.js.map