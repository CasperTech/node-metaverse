"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupActiveProposalItemReplyMessage {
    constructor() {
        this.name = 'GroupActiveProposalItemReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupActiveProposalItemReply;
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
            buf.writeUInt8(this.ProposalData[i]['TerseDateID'].length, pos++);
            this.ProposalData[i]['TerseDateID'].copy(buf, pos);
            pos += this.ProposalData[i]['TerseDateID'].length;
            buf.writeUInt8(this.ProposalData[i]['StartDateTime'].length, pos++);
            this.ProposalData[i]['StartDateTime'].copy(buf, pos);
            pos += this.ProposalData[i]['StartDateTime'].length;
            buf.writeUInt8(this.ProposalData[i]['EndDateTime'].length, pos++);
            this.ProposalData[i]['EndDateTime'].copy(buf, pos);
            pos += this.ProposalData[i]['EndDateTime'].length;
            buf.writeUInt8((this.ProposalData[i]['AlreadyVoted']) ? 1 : 0, pos++);
            buf.writeUInt8(this.ProposalData[i]['VoteCast'].length, pos++);
            this.ProposalData[i]['VoteCast'].copy(buf, pos);
            pos += this.ProposalData[i]['VoteCast'].length;
            buf.writeFloatLE(this.ProposalData[i]['Majority'], pos);
            pos += 4;
            buf.writeInt32LE(this.ProposalData[i]['Quorum'], pos);
            pos += 4;
            buf.writeUInt8(this.ProposalData[i]['ProposalText'].length, pos++);
            this.ProposalData[i]['ProposalText'].copy(buf, pos);
            pos += this.ProposalData[i]['ProposalText'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
                TerseDateID: Buffer.allocUnsafe(0),
                StartDateTime: Buffer.allocUnsafe(0),
                EndDateTime: Buffer.allocUnsafe(0),
                AlreadyVoted: false,
                VoteCast: Buffer.allocUnsafe(0),
                Majority: 0,
                Quorum: 0,
                ProposalText: Buffer.allocUnsafe(0)
            };
            newObjProposalData['VoteID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjProposalData['VoteInitiator'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjProposalData['TerseDateID'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjProposalData['StartDateTime'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjProposalData['EndDateTime'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjProposalData['AlreadyVoted'] = (buf.readUInt8(pos++) === 1);
            varLength = buf.readUInt8(pos++);
            newObjProposalData['VoteCast'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjProposalData['Majority'] = buf.readFloatLE(pos);
            pos += 4;
            newObjProposalData['Quorum'] = buf.readInt32LE(pos);
            pos += 4;
            varLength = buf.readUInt8(pos++);
            newObjProposalData['ProposalText'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.ProposalData.push(newObjProposalData);
        }
        return pos - startPos;
    }
}
exports.GroupActiveProposalItemReplyMessage = GroupActiveProposalItemReplyMessage;
//# sourceMappingURL=GroupActiveProposalItemReply.js.map