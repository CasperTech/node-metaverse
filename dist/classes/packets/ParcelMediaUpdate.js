"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ParcelMediaUpdatePacket {
    constructor() {
        this.name = 'ParcelMediaUpdate';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902180;
    }
    getSize() {
        return (this.DataBlock['MediaURL'].length + 1) + (this.DataBlockExtended['MediaType'].length + 1 + this.DataBlockExtended['MediaDesc'].length + 1) + 26;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.write(this.DataBlock['MediaURL'], pos);
        pos += this.DataBlock['MediaURL'].length;
        this.DataBlock['MediaID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.DataBlock['MediaAutoScale'], pos++);
        buf.write(this.DataBlockExtended['MediaType'], pos);
        pos += this.DataBlockExtended['MediaType'].length;
        buf.write(this.DataBlockExtended['MediaDesc'], pos);
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
        const newObjDataBlock = {
            MediaURL: '',
            MediaID: UUID_1.UUID.zero(),
            MediaAutoScale: 0
        };
        newObjDataBlock['MediaURL'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjDataBlock['MediaID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['MediaAutoScale'] = buf.readUInt8(pos++);
        this.DataBlock = newObjDataBlock;
        const newObjDataBlockExtended = {
            MediaType: '',
            MediaDesc: '',
            MediaWidth: 0,
            MediaHeight: 0,
            MediaLoop: 0
        };
        newObjDataBlockExtended['MediaType'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjDataBlockExtended['MediaDesc'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjDataBlockExtended['MediaWidth'] = buf.readInt32LE(pos);
        pos += 4;
        newObjDataBlockExtended['MediaHeight'] = buf.readInt32LE(pos);
        pos += 4;
        newObjDataBlockExtended['MediaLoop'] = buf.readUInt8(pos++);
        this.DataBlockExtended = newObjDataBlockExtended;
        return pos - startPos;
    }
}
exports.ParcelMediaUpdatePacket = ParcelMediaUpdatePacket;
//# sourceMappingURL=ParcelMediaUpdate.js.map