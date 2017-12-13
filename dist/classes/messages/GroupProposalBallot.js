"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupProposalBallotMessage {
    constructor() {
        this.name = 'GroupProposalBallot';
        this.messageFlags = MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupProposalBallot;
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
        buf.writeUInt8(this.ProposalData['VoteCast'].length, pos++);
        this.ProposalData['VoteCast'].copy(buf, pos);
        pos += this.ProposalData['VoteCast'].length;
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
        const newObjProposalData = {
            ProposalID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero(),
            VoteCast: Buffer.allocUnsafe(0)
        };
        newObjProposalData['ProposalID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjProposalData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjProposalData['VoteCast'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ProposalData = newObjProposalData;
        return pos - startPos;
    }
}
exports.GroupProposalBallotMessage = GroupProposalBallotMessage;
//# sourceMappingURL=GroupProposalBallot.js.map