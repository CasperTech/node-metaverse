"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SendXferPacketMessage {
    constructor() {
        this.name = 'SendXferPacket';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.SendXferPacket;
    }
    getSize() {
        return (this.DataPacket['Data'].length + 2) + 12;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.XferID['ID'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.XferID['ID'].high, pos);
        pos += 4;
        buf.writeUInt32LE(this.XferID['Packet'], pos);
        pos += 4;
        buf.writeUInt16LE(this.DataPacket['Data'].length, pos);
        pos += 2;
        this.DataPacket['Data'].copy(buf, pos);
        pos += this.DataPacket['Data'].length;
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
        const newObjDataPacket = {
            Data: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjDataPacket['Data'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.DataPacket = newObjDataPacket;
        return pos - startPos;
    }
}
exports.SendXferPacketMessage = SendXferPacketMessage;
//# sourceMappingURL=SendXferPacket.js.map