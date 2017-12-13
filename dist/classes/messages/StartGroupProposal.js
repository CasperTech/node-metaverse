"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class StartGroupProposalMessage {
    constructor() {
        this.name = 'StartGroupProposal';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.StartGroupProposal;
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
        buf.writeUInt8(this.ProposalData['ProposalText'].length, pos++);
        this.ProposalData['ProposalText'].copy(buf, pos);
        pos += this.ProposalData['ProposalText'].length;
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
            GroupID: UUID_1.UUID.zero(),
            Quorum: 0,
            Majority: 0,
            Duration: 0,
            ProposalText: Buffer.allocUnsafe(0)
        };
        newObjProposalData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjProposalData['Quorum'] = buf.readInt32LE(pos);
        pos += 4;
        newObjProposalData['Majority'] = buf.readFloatLE(pos);
        pos += 4;
        newObjProposalData['Duration'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjProposalData['ProposalText'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ProposalData = newObjProposalData;
        return pos - startPos;
    }
}
exports.StartGroupProposalMessage = StartGroupProposalMessage;
//# sourceMappingURL=StartGroupProposal.js.map