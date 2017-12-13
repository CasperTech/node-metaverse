"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupAccountDetailsReplyPacket {
    constructor() {
        this.name = 'GroupAccountDetailsReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902116;
    }
    getSize() {
        return (this.MoneyData['StartDate'].length + 1) + ((this.calculateVarVarSize(this.HistoryData, 'Description', 1) + 4) * this.HistoryData.length) + 57;
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
        this.MoneyData['RequestID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.MoneyData['IntervalDays'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['CurrentInterval'], pos);
        pos += 4;
        buf.write(this.MoneyData['StartDate'], pos);
        pos += this.MoneyData['StartDate'].length;
        const count = this.HistoryData.length;
        buf.writeUInt8(this.HistoryData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.write(this.HistoryData[i]['Description'], pos);
            pos += this.HistoryData[i]['Description'].length;
            buf.writeInt32LE(this.HistoryData[i]['Amount'], pos);
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
        const newObjMoneyData = {
            RequestID: UUID_1.UUID.zero(),
            IntervalDays: 0,
            CurrentInterval: 0,
            StartDate: ''
        };
        newObjMoneyData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMoneyData['IntervalDays'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['CurrentInterval'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['StartDate'] = buf.toString('utf8', pos, length);
        pos += length;
        this.MoneyData = newObjMoneyData;
        const count = buf.readUInt8(pos++);
        this.HistoryData = [];
        for (let i = 0; i < count; i++) {
            const newObjHistoryData = {
                Description: '',
                Amount: 0
            };
            newObjHistoryData['Description'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjHistoryData['Amount'] = buf.readInt32LE(pos);
            pos += 4;
            this.HistoryData.push(newObjHistoryData);
        }
        return pos - startPos;
    }
}
exports.GroupAccountDetailsReplyPacket = GroupAccountDetailsReplyPacket;
//# sourceMappingURL=GroupAccountDetailsReply.js.map