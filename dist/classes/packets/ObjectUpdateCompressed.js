"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ObjectUpdateCompressedPacket {
    constructor() {
        this.name = 'ObjectUpdateCompressed';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 13;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.ObjectData, 'Data', 2) + 4) * this.ObjectData.length) + 11;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.RegionData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.RegionData['RegionHandle'].high, pos);
        pos += 4;
        buf.writeUInt16LE(this.RegionData['TimeDilation'], pos);
        pos += 2;
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.ObjectData[i]['UpdateFlags'], pos);
            pos += 4;
            buf.write(this.ObjectData[i]['Data'], pos);
            pos += this.ObjectData[i]['Data'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjRegionData = {
            RegionHandle: Long.ZERO,
            TimeDilation: 0
        };
        newObjRegionData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjRegionData['TimeDilation'] = buf.readUInt16LE(pos);
        pos += 2;
        this.RegionData = newObjRegionData;
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++) {
            const newObjObjectData = {
                UpdateFlags: 0,
                Data: ''
            };
            newObjObjectData['UpdateFlags'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['Data'] = buf.toString('utf8', pos, length);
            pos += length;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.ObjectUpdateCompressedPacket = ObjectUpdateCompressedPacket;
//# sourceMappingURL=ObjectUpdateCompressed.js.map