"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ConfirmXferPacketMessage {
    constructor() {
        this.name = 'ConfirmXferPacket';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.ConfirmXferPacket;
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
        buf.writeUInt32LE(this.XferID['Packet'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjXferID = {
            ID: Long.ZERO,
            Packet: 0
        };
        newObjXferID['ID'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjXferID['Packet'] = buf.readUInt32LE(pos);
        pos += 4;
        this.XferID = newObjXferID;
        return pos - startPos;
    }
}
exports.ConfirmXferPacketMessage = ConfirmXferPacketMessage;
//# sourceMappingURL=ConfirmXferPacket.js.map