"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ScriptDataReplyPacket {
    constructor() {
        this.name = 'ScriptDataReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902098;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.DataBlock, 'Reply', 2) + 8) * this.DataBlock.length) + 1;
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
        const count = this.DataBlock.length;
        buf.writeUInt8(this.DataBlock.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeInt32LE(this.DataBlock[i]['Hash'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.DataBlock[i]['Hash'].high, pos);
            pos += 4;
            buf.write(this.DataBlock[i]['Reply'], pos);
            pos += this.DataBlock[i]['Reply'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const count = buf.readUInt8(pos++);
        this.DataBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjDataBlock = {
                Hash: Long.ZERO,
                Reply: ''
            };
            newObjDataBlock['Hash'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjDataBlock['Reply'] = buf.toString('utf8', pos, length);
            pos += length;
            this.DataBlock.push(newObjDataBlock);
        }
        return pos - startPos;
    }
}
exports.ScriptDataReplyPacket = ScriptDataReplyPacket;
//# sourceMappingURL=ScriptDataReply.js.map