"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class MoneyBalanceReplyMessage {
    constructor() {
        this.name = 'MoneyBalanceReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.MoneyBalanceReply;
    }
    getSize() {
        return (this.MoneyData['Description'].length + 1) + (this.TransactionInfo['ItemDescription'].length + 1) + 87;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.MoneyData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.MoneyData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.MoneyData['TransactionSuccess']) ? 1 : 0, pos++);
        buf.writeInt32LE(this.MoneyData['MoneyBalance'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['SquareMetersCredit'], pos);
        pos += 4;
        buf.writeInt32LE(this.MoneyData['SquareMetersCommitted'], pos);
        pos += 4;
        buf.writeUInt8(this.MoneyData['Description'].length, pos++);
        this.MoneyData['Description'].copy(buf, pos);
        pos += this.MoneyData['Description'].length;
        buf.writeInt32LE(this.TransactionInfo['TransactionType'], pos);
        pos += 4;
        this.TransactionInfo['SourceID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.TransactionInfo['IsSourceGroup']) ? 1 : 0, pos++);
        this.TransactionInfo['DestID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.TransactionInfo['IsDestGroup']) ? 1 : 0, pos++);
        buf.writeInt32LE(this.TransactionInfo['Amount'], pos);
        pos += 4;
        buf.writeUInt8(this.TransactionInfo['ItemDescription'].length, pos++);
        this.TransactionInfo['ItemDescription'].copy(buf, pos);
        pos += this.TransactionInfo['ItemDescription'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjMoneyData = {
            AgentID: UUID_1.UUID.zero(),
            TransactionID: UUID_1.UUID.zero(),
            TransactionSuccess: false,
            MoneyBalance: 0,
            SquareMetersCredit: 0,
            SquareMetersCommitted: 0,
            Description: Buffer.allocUnsafe(0)
        };
        newObjMoneyData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMoneyData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMoneyData['TransactionSuccess'] = (buf.readUInt8(pos++) === 1);
        newObjMoneyData['MoneyBalance'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['SquareMetersCredit'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['SquareMetersCommitted'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjMoneyData['Description'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.MoneyData = newObjMoneyData;
        const newObjTransactionInfo = {
            TransactionType: 0,
            SourceID: UUID_1.UUID.zero(),
            IsSourceGroup: false,
            DestID: UUID_1.UUID.zero(),
            IsDestGroup: false,
            Amount: 0,
            ItemDescription: Buffer.allocUnsafe(0)
        };
        newObjTransactionInfo['TransactionType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransactionInfo['SourceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransactionInfo['IsSourceGroup'] = (buf.readUInt8(pos++) === 1);
        newObjTransactionInfo['DestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransactionInfo['IsDestGroup'] = (buf.readUInt8(pos++) === 1);
        newObjTransactionInfo['Amount'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjTransactionInfo['ItemDescription'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.TransactionInfo = newObjTransactionInfo;
        return pos - startPos;
    }
}
exports.MoneyBalanceReplyMessage = MoneyBalanceReplyMessage;
//# sourceMappingURL=MoneyBalanceReply.js.map