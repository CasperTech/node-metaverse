"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TransferRequestMessage {
    constructor() {
        this.name = 'TransferRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TransferRequest;
    }
    getSize() {
        return (this.TransferInfo['Params'].length + 2) + 28;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.TransferInfo['TransferID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.TransferInfo['ChannelType'], pos);
        pos += 4;
        buf.writeInt32LE(this.TransferInfo['SourceType'], pos);
        pos += 4;
        buf.writeFloatLE(this.TransferInfo['Priority'], pos);
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
            SourceType: 0,
            Priority: 0,
            Params: Buffer.allocUnsafe(0)
        };
        newObjTransferInfo['TransferID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransferInfo['ChannelType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferInfo['SourceType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferInfo['Priority'] = buf.readFloatLE(pos);
        pos += 4;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjTransferInfo['Params'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.TransferInfo = newObjTransferInfo;
        return pos - startPos;
    }
}
exports.TransferRequestMessage = TransferRequestMessage;
//# sourceMappingURL=TransferRequest.js.map