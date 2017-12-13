"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupVoteHistoryItemReplyPacket {
    constructor() {
        this.name = 'GroupVoteHistoryItemReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902122;
    }
    getSize() {
        return (this.HistoryItemData['TerseDateID'].length + 1 + this.HistoryItemData['StartDateTime'].length + 1 + this.HistoryItemData['EndDateTime'].length + 1 + this.HistoryItemData['VoteType'].length + 1 + this.HistoryItemData['VoteResult'].length + 1 + this.HistoryItemData['ProposalText'].length + 2) + ((this.calculateVarVarSize(this.VoteItem, 'VoteCast', 1) + 20) * this.VoteItem.length) + 93;
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
        this.HistoryItemData['VoteID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.HistoryItemData['TerseDateID'], pos);
        pos += this.HistoryItemData['TerseDateID'].length;
        buf.write(this.HistoryItemData['StartDateTime'], pos);
        pos += this.HistoryItemData['StartDateTime'].length;
        buf.write(this.HistoryItemData['EndDateTime'], pos);
        pos += this.HistoryItemData['EndDateTime'].length;
        this.HistoryItemData['VoteInitiator'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.HistoryItemData['VoteType'], pos);
        pos += this.HistoryItemData['VoteType'].length;
        buf.write(this.HistoryItemData['VoteResult'], pos);
        pos += this.HistoryItemData['VoteResult'].length;
        buf.writeFloatLE(this.HistoryItemData['Majority'], pos);
        pos += 4;
        buf.writeInt32LE(this.HistoryItemData['Quorum'], pos);
        pos += 4;
        buf.write(this.HistoryItemData['ProposalText'], pos);
        pos += this.HistoryItemData['ProposalText'].length;
        const count = this.VoteItem.length;
        buf.writeUInt8(this.VoteItem.length, pos++);
        for (let i = 0; i < count; i++) {
            this.VoteItem[i]['CandidateID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.write(this.VoteItem[i]['VoteCast'], pos);
            pos += this.VoteItem[i]['VoteCast'].length;
            buf.writeInt32LE(this.VoteItem[i]['NumVotes'], pos);
            pos += 4;
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
        const newObjHistoryItemData = {
            VoteID: UUID_1.UUID.zero(),
            TerseDateID: '',
            StartDateTime: '',
            EndDateTime: '',
            VoteInitiator: UUID_1.UUID.zero(),
            VoteType: '',
            VoteResult: '',
            Majority: 0,
            Quorum: 0,
            ProposalText: ''
        };
        newObjHistoryItemData['VoteID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjHistoryItemData['TerseDateID'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjHistoryItemData['StartDateTime'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjHistoryItemData['EndDateTime'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjHistoryItemData['VoteInitiator'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjHistoryItemData['VoteType'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjHistoryItemData['VoteResult'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjHistoryItemData['Majority'] = buf.readFloatLE(pos);
        pos += 4;
        newObjHistoryItemData['Quorum'] = buf.readInt32LE(pos);
        pos += 4;
        newObjHistoryItemData['ProposalText'] = buf.toString('utf8', pos, length);
        pos += length;
        this.HistoryItemData = newObjHistoryItemData;
        const count = buf.readUInt8(pos++);
        this.VoteItem = [];
        for (let i = 0; i < count; i++) {
            const newObjVoteItem = {
                CandidateID: UUID_1.UUID.zero(),
                VoteCast: '',
                NumVotes: 0
            };
            newObjVoteItem['CandidateID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjVoteItem['VoteCast'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjVoteItem['NumVotes'] = buf.readInt32LE(pos);
            pos += 4;
            this.VoteItem.push(newObjVoteItem);
        }
        return pos - startPos;
    }
}
exports.GroupVoteHistoryItemReplyPacket = GroupVoteHistoryItemReplyPacket;
//# sourceMappingURL=GroupVoteHistoryItemReply.js.map