"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ParcelOverlayMessage {
    constructor() {
        this.name = 'ParcelOverlay';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ParcelOverlay;
    }
    getSize() {
        return (this.ParcelData['Data'].length + 2) + 4;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.ParcelData['SequenceID'], pos);
        pos += 4;
        buf.writeUInt16LE(this.ParcelData['Data'].length, pos);
        pos += 2;
        this.ParcelData['Data'].copy(buf, pos);
        pos += this.ParcelData['Data'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjParcelData = {
            SequenceID: 0,
            Data: Buffer.allocUnsafe(0)
        };
        newObjParcelData['SequenceID'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjParcelData['Data'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ParcelData = newObjParcelData;
        return pos - startPos;
    }
}
exports.ParcelOverlayMessage = ParcelOverlayMessage;
//# sourceMappingURL=ParcelOverlay.js.map