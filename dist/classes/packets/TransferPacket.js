"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TransferPacketPacket {
    constructor() {
        this.name = 'TransferPacket';
        this.flags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 17;
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
        buf.write(this.TransferData['Data'], pos);
        pos += this.TransferData['Data'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjTransferData = {
            TransferID: UUID_1.UUID.zero(),
            ChannelType: 0,
            Packet: 0,
            Status: 0,
            Data: ''
        };
        newObjTransferData['TransferID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransferData['ChannelType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferData['Packet'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferData['Status'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferData['Data'] = buf.toString('utf8', pos, length);
        pos += length;
        this.TransferData = newObjTransferData;
        return pos - startPos;
    }
}
exports.TransferPacketPacket = TransferPacketPacket;
//# sourceMappingURL=TransferPacket.js.map