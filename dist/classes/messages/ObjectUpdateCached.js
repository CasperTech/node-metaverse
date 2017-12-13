"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ObjectUpdateCachedMessage {
    constructor() {
        this.name = 'ObjectUpdateCached';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.ObjectUpdateCached;
    }
    getSize() {
        return ((12) * this.ObjectData.length) + 11;
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
            buf.writeUInt32LE(this.ObjectData[i]['ID'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['CRC'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['UpdateFlags'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
                ID: 0,
                CRC: 0,
                UpdateFlags: 0
            };
            newObjObjectData['ID'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['CRC'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['UpdateFlags'] = buf.readUInt32LE(pos);
            pos += 4;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.ObjectUpdateCachedMessage = ObjectUpdateCachedMessage;
//# sourceMappingURL=ObjectUpdateCached.js.map