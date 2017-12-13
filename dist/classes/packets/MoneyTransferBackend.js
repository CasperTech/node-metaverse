"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MoneyTransferBackendPacket {
    constructor() {
        this.name = 'MoneyTransferBackend';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902072;
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
        buf.write(this.MoneyData['Description'], pos);
        pos += this.MoneyData['Description'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
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
            Description: ''
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
        newObjMoneyData['Description'] = buf.toString('utf8', pos, length);
        pos += length;
        this.MoneyData = newObjMoneyData;
        return pos - startPos;
    }
}
exports.MoneyTransferBackendPacket = MoneyTransferBackendPacket;
//# sourceMappingURL=MoneyTransferBackend.js.map