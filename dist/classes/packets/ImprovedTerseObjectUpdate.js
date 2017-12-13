"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ImprovedTerseObjectUpdatePacket {
    constructor() {
        this.name = 'ImprovedTerseObjectUpdate';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 15;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.ObjectData, 'Data', 1) + this.calculateVarVarSize(this.ObjectData, 'TextureEntry', 2)) * this.ObjectData.length) + 11;
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
            buf.write(this.ObjectData[i]['Data'], pos);
            pos += this.ObjectData[i]['Data'].length;
            buf.write(this.ObjectData[i]['TextureEntry'], pos);
            pos += this.ObjectData[i]['TextureEntry'].length;
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
                Data: '',
                TextureEntry: ''
            };
            newObjObjectData['Data'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjObjectData['TextureEntry'] = buf.toString('utf8', pos, length);
            pos += length;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.ImprovedTerseObjectUpdatePacket = ImprovedTerseObjectUpdatePacket;
//# sourceMappingURL=ImprovedTerseObjectUpdate.js.map