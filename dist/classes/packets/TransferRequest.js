"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TransferRequestPacket {
    constructor() {
        this.name = 'TransferRequest';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901913;
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
        buf.write(this.TransferInfo['Params'], pos);
        pos += this.TransferInfo['Params'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjTransferInfo = {
            TransferID: UUID_1.UUID.zero(),
            ChannelType: 0,
            SourceType: 0,
            Priority: 0,
            Params: ''
        };
        newObjTransferInfo['TransferID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransferInfo['ChannelType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferInfo['SourceType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjTransferInfo['Priority'] = buf.readFloatLE(pos);
        pos += 4;
        newObjTransferInfo['Params'] = buf.toString('utf8', pos, length);
        pos += length;
        this.TransferInfo = newObjTransferInfo;
        return pos - startPos;
    }
}
exports.TransferRequestPacket = TransferRequestPacket;
//# sourceMappingURL=TransferRequest.js.map