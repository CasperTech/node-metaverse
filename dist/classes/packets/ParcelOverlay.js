"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class ParcelOverlayPacket {
    constructor() {
        this.name = 'ParcelOverlay';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901956;
    }
    getSize() {
        return (this.ParcelData['Data'].length + 2) + 4;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.ParcelData['SequenceID'], pos);
        pos += 4;
        buf.write(this.ParcelData['Data'], pos);
        pos += this.ParcelData['Data'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjParcelData = {
            SequenceID: 0,
            Data: ''
        };
        newObjParcelData['SequenceID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['Data'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ParcelData = newObjParcelData;
        return pos - startPos;
    }
}
exports.ParcelOverlayPacket = ParcelOverlayPacket;
//# sourceMappingURL=ParcelOverlay.js.map