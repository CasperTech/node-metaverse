"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ScriptDataRequestMessage {
    constructor() {
        this.name = 'ScriptDataRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ScriptDataRequest;
    }
    getSize() {
        return this.calculateVarVarSize(this.DataBlock, 'Request', 2) + ((9) * this.DataBlock.length) + 1;
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
            buf.writeUInt16LE(this.DataBlock[i]['Request'].length, pos);
            pos += 2;
            this.DataBlock[i]['Request'].copy(buf, pos);
            pos += this.DataBlock[i]['Request'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const count = buf.readUInt8(pos++);
        this.DataBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjDataBlock = {
                Hash: Long.ZERO,
                RequestType: 0,
                Request: Buffer.allocUnsafe(0)
            };
            newObjDataBlock['Hash'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjDataBlock['RequestType'] = buf.readInt8(pos++);
            varLength = buf.readUInt16LE(pos);
            pos += 2;
            newObjDataBlock['Request'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.DataBlock.push(newObjDataBlock);
        }
        return pos - startPos;
    }
}
exports.ScriptDataRequestMessage = ScriptDataRequestMessage;
//# sourceMappingURL=ScriptDataRequest.js.map