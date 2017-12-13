"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AbortXferPacket {
    constructor() {
        this.name = 'AbortXfer';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901917;
    }
    getSize() {
        return 12;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.XferID['ID'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.XferID['ID'].high, pos);
        pos += 4;
        buf.writeInt32LE(this.XferID['Result'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjXferID = {
            ID: Long.ZERO,
            Result: 0
        };
        newObjXferID['ID'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjXferID['Result'] = buf.readInt32LE(pos);
        pos += 4;
        this.XferID = newObjXferID;
        return pos - startPos;
    }
}
exports.AbortXferPacket = AbortXferPacket;
//# sourceMappingURL=AbortXfer.js.map