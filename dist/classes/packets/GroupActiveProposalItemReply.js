"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupActiveProposalItemReplyPacket {
    constructor() {
        this.name = 'GroupActiveProposalItemReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902120;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.ProposalData, 'TerseDateID', 1) + this.calculateVarVarSize(this.ProposalData, 'StartDateTime', 1) + this.calculateVarVarSize(this.ProposalData, 'EndDateTime', 1) + this.calculateVarVarSize(this.ProposalData, 'VoteCast', 1) + this.calculateVarVarSize(this.ProposalData, 'ProposalText', 1) + 41) * this.ProposalData.length) + 53;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        this.TransactionData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.TransactionData['TotalNumItems'], pos);
        pos += 4;
        const count = this.ProposalData.length;
        buf.writeUInt8(this.ProposalData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ProposalData[i]['VoteID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ProposalData[i]['VoteInitiator'].writeToBuffer(buf, pos);
            pos += 16;
            buf.write(this.ProposalData[i]['TerseDateID'], pos);
            pos += this.ProposalData[i]['TerseDateID'].length;
            buf.write(this.ProposalData[i]['StartDateTime'], pos);
            pos += this.ProposalData[i]['StartDateTime'].length;
            buf.write(this.ProposalData[i]['EndDateTime'], pos);
            pos += this.ProposalData[i]['EndDateTime'].length;
            buf.writeUInt8((this.ProposalData[i]['AlreadyVoted']) ? 1 : 0, pos++);
            buf.write(this.ProposalData[i]['VoteCast'], pos);
            pos += this.ProposalData[i]['VoteCast'].length;
            buf.writeFloatLE(this.ProposalData[i]['Majority'], pos);
            pos += 4;
            buf.writeInt32LE(this.ProposalData[i]['Quorum'], pos);
            pos += 4;
            buf.write(this.ProposalData[i]['ProposalText'], pos);
            pos += this.ProposalData[i]['ProposalText'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjTransactionData = {
            TransactionID: UUID_1.UUID.zero(),
            TotalNumItems: 0
        };
        newObjTransactionData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransactionData['TotalNumItems'] = buf.readUInt32LE(pos);
        pos += 4;
        this.TransactionData = newObjTransactionData;
        const count = buf.readUInt8(pos++);
        this.ProposalData = [];
        for (let i = 0; i < count; i++) {
            const newObjProposalData = {
                VoteID: UUID_1.UUID.zero(),
                VoteInitiator: UUID_1.UUID.zero(),
                TerseDateID: '',
                StartDateTime: '',
                EndDateTime: '',
                AlreadyVoted: false,
                VoteCast: '',
                Majority: 0,
                Quorum: 0,
                ProposalText: ''
            };
            newObjProposalData['VoteID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjProposalData['VoteInitiator'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjProposalData['TerseDateID'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjProposalData['StartDateTime'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjProposalData['EndDateTime'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjProposalData['AlreadyVoted'] = (buf.readUInt8(pos++) === 1);
            newObjProposalData['VoteCast'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjProposalData['Majority'] = buf.readFloatLE(pos);
            pos += 4;
            newObjProposalData['Quorum'] = buf.readInt32LE(pos);
            pos += 4;
            newObjProposalData['ProposalText'] = buf.toString('utf8', pos, length);
            pos += length;
            this.ProposalData.push(newObjProposalData);
        }
        return pos - startPos;
    }
}
exports.GroupActiveProposalItemReplyPacket = GroupActiveProposalItemReplyPacket;
//# sourceMappingURL=GroupActiveProposalItemReply.js.map