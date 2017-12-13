"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ScriptDataRequestPacket {
    constructor() {
        this.name = 'ScriptDataRequest';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902097;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.DataBlock, 'Request', 2) + 9) * this.DataBlock.length) + 1;
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
            buf.writeInt8(this.DataBlock[i]['RequestType'], pos++);
            buf.write(this.DataBlock[i]['Request'], pos);
            pos += this.DataBlock[i]['Request'].length;
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
                RequestType: 0,
                Request: ''
            };
            newObjDataBlock['Hash'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjDataBlock['RequestType'] = buf.readInt8(pos++);
            newObjDataBlock['Request'] = buf.toString('utf8', pos, length);
            pos += length;
            this.DataBlock.push(newObjDataBlock);
        }
        return pos - startPos;
    }
}
exports.ScriptDataRequestPacket = ScriptDataRequestPacket;
//# sourceMappingURL=ScriptDataRequest.js.map