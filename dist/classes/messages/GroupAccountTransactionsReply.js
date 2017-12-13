"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupAccountTransactionsReplyMessage {
    constructor() {
        this.name = 'GroupAccountTransactionsReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupAccountTransactionsReply;
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
        buf.writeUInt8(this.MoneyData['StartDate'].length, pos++);
        this.MoneyData['StartDate'].copy(buf, pos);
        pos += this.MoneyData['StartDate'].length;
        const count = this.HistoryData.length;
        buf.writeUInt8(this.HistoryData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.HistoryData[i]['Time'].length, pos++);
            this.HistoryData[i]['Time'].copy(buf, pos);
            pos += this.HistoryData[i]['Time'].length;
            buf.writeUInt8(this.HistoryData[i]['User'].length, pos++);
            this.HistoryData[i]['User'].copy(buf, pos);
            pos += this.HistoryData[i]['User'].length;
            buf.writeInt32LE(this.HistoryData[i]['Type'], pos);
            pos += 4;
            buf.writeUInt8(this.HistoryData[i]['Item'].length, pos++);
            this.HistoryData[i]['Item'].copy(buf, pos);
            pos += this.HistoryData[i]['Item'].length;
            buf.writeInt32LE(this.HistoryData[i]['Amount'], pos);
            pos += 4;
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
        const newObjMoneyData = {
            RequestID: UUID_1.UUID.zero(),
            IntervalDays: 0,
            CurrentInterval: 0,
            StartDate: Buffer.allocUnsafe(0)
        };
        newObjMoneyData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMoneyData['IntervalDays'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['CurrentInterval'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjMoneyData['StartDate'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.MoneyData = newObjMoneyData;
        const count = buf.readUInt8(pos++);
        this.HistoryData = [];
        for (let i = 0; i < count; i++) {
            const newObjHistoryData = {
                Time: Buffer.allocUnsafe(0),
                User: Buffer.allocUnsafe(0),
                Type: 0,
                Item: Buffer.allocUnsafe(0),
                Amount: 0
            };
            varLength = buf.readUInt8(pos++);
            newObjHistoryData['Time'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjHistoryData['User'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjHistoryData['Type'] = buf.readInt32LE(pos);
            pos += 4;
            varLength = buf.readUInt8(pos++);
            newObjHistoryData['Item'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjHistoryData['Amount'] = buf.readInt32LE(pos);
            pos += 4;
            this.HistoryData.push(newObjHistoryData);
        }
        return pos - startPos;
    }
}
exports.GroupAccountTransactionsReplyMessage = GroupAccountTransactionsReplyMessage;
//# sourceMappingURL=GroupAccountTransactionsReply.js.map