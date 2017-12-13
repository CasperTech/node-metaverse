"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ParcelMediaUpdateMessage {
    constructor() {
        this.name = 'ParcelMediaUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ParcelMediaUpdate;
    }
    getSize() {
        return (this.DataBlock['MediaURL'].length + 1) + (this.DataBlockExtended['MediaType'].length + 1 + this.DataBlockExtended['MediaDesc'].length + 1) + 26;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.DataBlock['MediaURL'].length, pos++);
        this.DataBlock['MediaURL'].copy(buf, pos);
        pos += this.DataBlock['MediaURL'].length;
        this.DataBlock['MediaID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.DataBlock['MediaAutoScale'], pos++);
        buf.writeUInt8(this.DataBlockExtended['MediaType'].length, pos++);
        this.DataBlockExtended['MediaType'].copy(buf, pos);
        pos += this.DataBlockExtended['MediaType'].length;
        buf.writeUInt8(this.DataBlockExtended['MediaDesc'].length, pos++);
        this.DataBlockExtended['MediaDesc'].copy(buf, pos);
        pos += this.DataBlockExtended['MediaDesc'].length;
        buf.writeInt32LE(this.DataBlockExtended['MediaWidth'], pos);
        pos += 4;
        buf.writeInt32LE(this.DataBlockExtended['MediaHeight'], pos);
        pos += 4;
        buf.writeUInt8(this.DataBlockExtended['MediaLoop'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjDataBlock = {
            MediaURL: Buffer.allocUnsafe(0),
            MediaID: UUID_1.UUID.zero(),
            MediaAutoScale: 0
        };
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['MediaURL'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjDataBlock['MediaID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['MediaAutoScale'] = buf.readUInt8(pos++);
        this.DataBlock = newObjDataBlock;
        const newObjDataBlockExtended = {
            MediaType: Buffer.allocUnsafe(0),
            MediaDesc: Buffer.allocUnsafe(0),
            MediaWidth: 0,
            MediaHeight: 0,
            MediaLoop: 0
        };
        varLength = buf.readUInt8(pos++);
        newObjDataBlockExtended['MediaType'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjDataBlockExtended['MediaDesc'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjDataBlockExtended['MediaWidth'] = buf.readInt32LE(pos);
        pos += 4;
        newObjDataBlockExtended['MediaHeight'] = buf.readInt32LE(pos);
        pos += 4;
        newObjDataBlockExtended['MediaLoop'] = buf.readUInt8(pos++);
        this.DataBlockExtended = newObjDataBlockExtended;
        return pos - startPos;
    }
}
exports.ParcelMediaUpdateMessage = ParcelMediaUpdateMessage;
//# sourceMappingURL=ParcelMediaUpdate.js.map