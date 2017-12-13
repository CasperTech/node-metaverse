"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class MoneyTransferBackendMessage {
    constructor() {
        this.name = 'MoneyTransferBackend';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.MoneyTransferBackend;
    }
    getSize() {
        return (this.MoneyData['Description'].length + 1) + 87;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.MoneyData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.MoneyData['TransactionTime'], pos);
        pos += 4;
        this.MoneyData['SourceID'].writeToBuffer(buf, pos);
        pos += 16;
        this.MoneyData['DestID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.MoneyData['Flags'], pos++);
        buf.writeInt32LE(this.MoneyData['Amount'], pos);
        pos += 4;
        buf.writeUInt8(this.MoneyData['AggregatePermNextOwner'], pos++);
        buf.writeUInt8(this.MoneyData['AggregatePermInventory'], pos++);
        buf.writeInt32LE(this.MoneyData['TransactionType'], pos);
        pos += 4;
        this.MoneyData['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.MoneyData['GridX'], pos);
        pos += 4;
        buf.writeUInt32LE(this.MoneyData['GridY'], pos);
        pos += 4;
        buf.writeUInt8(this.MoneyData['Description'].length, pos++);
        this.MoneyData['Description'].copy(buf, pos);
        pos += this.MoneyData['Description'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjMoneyData = {
            TransactionID: UUID_1.UUID.zero(),
            TransactionTime: 0,
            SourceID: UUID_1.UUID.zero(),
            DestID: UUID_1.UUID.zero(),
            Flags: 0,
            Amount: 0,
            AggregatePermNextOwner: 0,
            AggregatePermInventory: 0,
            TransactionType: 0,
            RegionID: UUID_1.UUID.zero(),
            GridX: 0,
            GridY: 0,
            Description: Buffer.allocUnsafe(0)
        };
        newObjMoneyData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMoneyData['TransactionTime'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjMoneyData['SourceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMoneyData['DestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMoneyData['Flags'] = buf.readUInt8(pos++);
        newObjMoneyData['Amount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['AggregatePermNextOwner'] = buf.readUInt8(pos++);
        newObjMoneyData['AggregatePermInventory'] = buf.readUInt8(pos++);
        newObjMoneyData['TransactionType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMoneyData['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMoneyData['GridX'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjMoneyData['GridY'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjMoneyData['Description'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.MoneyData = newObjMoneyData;
        return pos - startPos;
    }
}
exports.MoneyTransferBackendMessage = MoneyTransferBackendMessage;
//# sourceMappingURL=MoneyTransferBackend.js.map