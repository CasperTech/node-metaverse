"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TransferAbortPacket {
    constructor() {
        this.name = 'TransferAbort';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901915;
    }
    getSize() {
        return 20;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.TransferInfo['TransferID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.TransferInfo['ChannelType'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjTransferInfo = {
            TransferID: UUID_1.UUID.zero(),
            ChannelType: 0
        };
        newObjTransferInfo['TransferID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransferInfo['ChannelType'] = buf.readInt32LE(pos);
        pos += 4;
        this.TransferInfo = newObjTransferInfo;
        return pos - startPos;
    }
}
exports.TransferAbortPacket = TransferAbortPacket;
//# sourceMappingURL=TransferAbort.js.map