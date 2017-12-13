"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SendXferPacketPacket {
    constructor() {
        this.name = 'SendXferPacket';
        this.flags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 18;
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
        buf.write(this.DataPacket['Data'], pos);
        pos += this.DataPacket['Data'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
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
            Data: ''
        };
        newObjDataPacket['Data'] = buf.toString('utf8', pos, length);
        pos += length;
        this.DataPacket = newObjDataPacket;
        return pos - startPos;
    }
}
exports.SendXferPacketPacket = SendXferPacketPacket;
//# sourceMappingURL=SendXferPacket.js.map