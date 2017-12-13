"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TransferPacketMessage {
    constructor() {
        this.name = 'TransferPacket';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.TransferPacket;
    }
    getSize() {
        return (this.TransferData['Data'].length + 2) + 28;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.TransferData['TransferID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.TransferData['ChannelType'], pos);
        pos += 4;
        buf.writeInt32LE(this.TransferData['Packet'], pos);
        pos += 4;
        buf.writeInt32LE(this.TransferData['Status'], pos);
        pos += 4;
        buf.writeUInt16LE(this.TransferData['Data'].length, pos);
        pos += 2;
        this.TransferData['Data'].copy(buf, pos);
        pos += this.TransferData['Data'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjTransferData = {
            TransferID: UUID_1.UUID.zero(),
            ChannelType: 0,
            Packet: 0,
            Status: 0,
            Data: Buffer.allocUnsafe(0)
        };
        newObjTransferData['TransferID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransferData['ChannelType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferData['Packet'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferData['Status'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjTransferData['Data'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.TransferData = newObjTransferData;
        return pos - startPos;
    }
}
exports.TransferPacketMessage = TransferPacketMessage;
//# sourceMappingURL=TransferPacket.js.map