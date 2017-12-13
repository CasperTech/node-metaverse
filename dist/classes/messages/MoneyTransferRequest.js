"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class MoneyTransferRequestMessage {
    constructor() {
        this.name = 'MoneyTransferRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.MoneyTransferRequest;
    }
    getSize() {
        return (this.MoneyData['Description'].length + 1) + 75;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
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
        buf.writeUInt8(this.MoneyData['Description'].length, pos++);
        this.MoneyData['Description'].copy(buf, pos);
        pos += this.MoneyData['Description'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjMoneyData = {
            SourceID: UUID_1.UUID.zero(),
            DestID: UUID_1.UUID.zero(),
            Flags: 0,
            Amount: 0,
            AggregatePermNextOwner: 0,
            AggregatePermInventory: 0,
            TransactionType: 0,
            Description: Buffer.allocUnsafe(0)
        };
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
        varLength = buf.readUInt8(pos++);
        newObjMoneyData['Description'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.MoneyData = newObjMoneyData;
        return pos - startPos;
    }
}
exports.MoneyTransferRequestMessage = MoneyTransferRequestMessage;
//# sourceMappingURL=MoneyTransferRequest.js.map