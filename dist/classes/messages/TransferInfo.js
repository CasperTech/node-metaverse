"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TransferInfoMessage {
    constructor() {
        this.name = 'TransferInfo';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TransferInfo;
    }
    getSize() {
        return (this.TransferInfo['Params'].length + 2) + 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.TransferInfo['TransferID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.TransferInfo['ChannelType'], pos);
        pos += 4;
        buf.writeInt32LE(this.TransferInfo['TargetType'], pos);
        pos += 4;
        buf.writeInt32LE(this.TransferInfo['Status'], pos);
        pos += 4;
        buf.writeInt32LE(this.TransferInfo['Size'], pos);
        pos += 4;
        buf.writeUInt16LE(this.TransferInfo['Params'].length, pos);
        pos += 2;
        this.TransferInfo['Params'].copy(buf, pos);
        pos += this.TransferInfo['Params'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjTransferInfo = {
            TransferID: UUID_1.UUID.zero(),
            ChannelType: 0,
            TargetType: 0,
            Status: 0,
            Size: 0,
            Params: Buffer.allocUnsafe(0)
        };
        newObjTransferInfo['TransferID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransferInfo['ChannelType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferInfo['TargetType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferInfo['Status'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferInfo['Size'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjTransferInfo['Params'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.TransferInfo = newObjTransferInfo;
        return pos - startPos;
    }
}
exports.TransferInfoMessage = TransferInfoMessage;
//# sourceMappingURL=TransferInfo.js.map