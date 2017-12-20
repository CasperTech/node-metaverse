"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class LogTextMessageMessage {
    constructor() {
        this.name = 'LogTextMessage';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.LogTextMessage;
    }
    getSize() {
        return this.calculateVarVarSize(this.DataBlock, 'Message', 2) + ((52) * this.DataBlock.length) + 1;
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
            this.DataBlock[i]['FromAgentId'].writeToBuffer(buf, pos);
            pos += 16;
            this.DataBlock[i]['ToAgentId'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeDoubleLE(this.DataBlock[i]['GlobalX'], pos);
            pos += 8;
            buf.writeDoubleLE(this.DataBlock[i]['GlobalY'], pos);
            pos += 8;
            buf.writeUInt32LE(this.DataBlock[i]['Time'], pos);
            pos += 4;
            buf.writeUInt16LE(this.DataBlock[i]['Message'].length, pos);
            pos += 2;
            this.DataBlock[i]['Message'].copy(buf, pos);
            pos += this.DataBlock[i]['Message'].length;
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
                FromAgentId: UUID_1.UUID.zero(),
                ToAgentId: UUID_1.UUID.zero(),
                GlobalX: 0,
                GlobalY: 0,
                Time: 0,
                Message: Buffer.allocUnsafe(0)
            };
            newObjDataBlock['FromAgentId'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjDataBlock['ToAgentId'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjDataBlock['GlobalX'] = buf.readDoubleLE(pos);
            pos += 8;
            newObjDataBlock['GlobalY'] = buf.readDoubleLE(pos);
            pos += 8;
            newObjDataBlock['Time'] = buf.readUInt32LE(pos);
            pos += 4;
            varLength = buf.readUInt16LE(pos);
            pos += 2;
            newObjDataBlock['Message'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.DataBlock.push(newObjDataBlock);
        }
        return pos - startPos;
    }
}
exports.LogTextMessageMessage = LogTextMessageMessage;
//# sourceMappingURL=LogTextMessage.js.map