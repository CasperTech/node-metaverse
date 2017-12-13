"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const MessageFlags_1 = require("../../enums/MessageFlags");
class LogFailedMoneyTransactionPacket {
    constructor() {
        this.name = 'LogFailedMoneyTransaction';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901780;
    }
    getSize() {
        return 74;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.TransactionData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.TransactionData['TransactionTime'], pos);
        pos += 4;
        buf.writeInt32LE(this.TransactionData['TransactionType'], pos);
        pos += 4;
        this.TransactionData['SourceID'].writeToBuffer(buf, pos);
        pos += 16;
        this.TransactionData['DestID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.TransactionData['Flags'], pos++);
        buf.writeInt32LE(this.TransactionData['Amount'], pos);
        pos += 4;
        this.TransactionData['SimulatorIP'].writeToBuffer(buf, pos);
        pos += 4;
        buf.writeUInt32LE(this.TransactionData['GridX'], pos);
        pos += 4;
        buf.writeUInt32LE(this.TransactionData['GridY'], pos);
        pos += 4;
        buf.writeUInt8(this.TransactionData['FailureType'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjTransactionData = {
            TransactionID: UUID_1.UUID.zero(),
            TransactionTime: 0,
            TransactionType: 0,
            SourceID: UUID_1.UUID.zero(),
            DestID: UUID_1.UUID.zero(),
            Flags: 0,
            Amount: 0,
            SimulatorIP: IPAddress_1.IPAddress.zero(),
            GridX: 0,
            GridY: 0,
            FailureType: 0
        };
        newObjTransactionData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransactionData['TransactionTime'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjTransactionData['TransactionType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransactionData['SourceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransactionData['DestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransactionData['Flags'] = buf.readUInt8(pos++);
        newObjTransactionData['Amount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransactionData['SimulatorIP'] = new IPAddress_1.IPAddress(buf, pos);
        pos += 4;
        newObjTransactionData['GridX'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjTransactionData['GridY'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjTransactionData['FailureType'] = buf.readUInt8(pos++);
        this.TransactionData = newObjTransactionData;
        return pos - startPos;
    }
}
exports.LogFailedMoneyTransactionPacket = LogFailedMoneyTransactionPacket;
//# sourceMappingURL=LogFailedMoneyTransaction.js.map