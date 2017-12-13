"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupAccountSummaryReplyPacket {
    constructor() {
        this.name = 'GroupAccountSummaryReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902114;
    }
    getSize() {
        return (this.MoneyData['StartDate'].length + 1 + this.MoneyData['LastTaxDate'].length + 1 + this.MoneyData['TaxDate'].length + 1) + 112;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        this.MoneyData['RequestID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.MoneyData['IntervalDays'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['CurrentInterval'], pos);
        pos += 4;
        buf.write(this.MoneyData['StartDate'], pos);
        pos += this.MoneyData['StartDate'].length;
        buf.writeInt32LE(this.MoneyData['Balance'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['TotalCredits'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['TotalDebits'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['ObjectTaxCurrent'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['LightTaxCurrent'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['LandTaxCurrent'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['GroupTaxCurrent'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['ParcelDirFeeCurrent'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['ObjectTaxEstimate'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['LightTaxEstimate'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['LandTaxEstimate'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['GroupTaxEstimate'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['ParcelDirFeeEstimate'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['NonExemptMembers'], pos);
        pos += 4;
        buf.write(this.MoneyData['LastTaxDate'], pos);
        pos += this.MoneyData['LastTaxDate'].length;
        buf.write(this.MoneyData['TaxDate'], pos);
        pos += this.MoneyData['TaxDate'].length;
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
        const newObjMoneyData = {
            RequestID: UUID_1.UUID.zero(),
            IntervalDays: 0,
            CurrentInterval: 0,
            StartDate: '',
            Balance: 0,
            TotalCredits: 0,
            TotalDebits: 0,
            ObjectTaxCurrent: 0,
            LightTaxCurrent: 0,
            LandTaxCurrent: 0,
            GroupTaxCurrent: 0,
            ParcelDirFeeCurrent: 0,
            ObjectTaxEstimate: 0,
            LightTaxEstimate: 0,
            LandTaxEstimate: 0,
            GroupTaxEstimate: 0,
            ParcelDirFeeEstimate: 0,
            NonExemptMembers: 0,
            LastTaxDate: '',
            TaxDate: ''
        };
        newObjMoneyData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMoneyData['IntervalDays'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['CurrentInterval'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['StartDate'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjMoneyData['Balance'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['TotalCredits'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['TotalDebits'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['ObjectTaxCurrent'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['LightTaxCurrent'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['LandTaxCurrent'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['GroupTaxCurrent'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['ParcelDirFeeCurrent'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['ObjectTaxEstimate'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['LightTaxEstimate'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['LandTaxEstimate'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['GroupTaxEstimate'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['ParcelDirFeeEstimate'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['NonExemptMembers'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['LastTaxDate'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjMoneyData['TaxDate'] = buf.toString('utf8', pos, length);
        pos += length;
        this.MoneyData = newObjMoneyData;
        return pos - startPos;
    }
}
exports.GroupAccountSummaryReplyPacket = GroupAccountSummaryReplyPacket;
//# sourceMappingURL=GroupAccountSummaryReply.js.map