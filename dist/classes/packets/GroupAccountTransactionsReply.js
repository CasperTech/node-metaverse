"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupAccountTransactionsReplyPacket {
    constructor() {
        this.name = 'GroupAccountTransactionsReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902118;
    }
    getSize() {
        return (this.MoneyData['StartDate'].length + 1) + ((this.calculateVarVarSize(this.HistoryData, 'Time', 1) + this.calculateVarVarSize(this.HistoryData, 'User', 1) + this.calculateVarVarSize(this.HistoryData, 'Item', 1) + 8) * this.HistoryData.length) + 57;
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
            buf.write(this.HistoryData[i]['Time'], pos);
            pos += this.HistoryData[i]['Time'].length;
            buf.write(this.HistoryData[i]['User'], pos);
            pos += this.HistoryData[i]['User'].length;
            buf.writeInt32LE(this.HistoryData[i]['Type'], pos);
            pos += 4;
            buf.write(this.HistoryData[i]['Item'], pos);
            pos += this.HistoryData[i]['Item'].length;
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
                Time: '',
                User: '',
                Type: 0,
                Item: '',
                Amount: 0
            };
            newObjHistoryData['Time'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjHistoryData['User'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjHistoryData['Type'] = buf.readInt32LE(pos);
            pos += 4;
            newObjHistoryData['Item'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjHistoryData['Amount'] = buf.readInt32LE(pos);
            pos += 4;
            this.HistoryData.push(newObjHistoryData);
        }
        return pos - startPos;
    }
}
exports.GroupAccountTransactionsReplyPacket = GroupAccountTransactionsReplyPacket;
//# sourceMappingURL=GroupAccountTransactionsReply.js.map