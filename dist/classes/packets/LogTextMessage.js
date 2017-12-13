"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class LogTextMessagePacket {
    constructor() {
        this.name = 'LogTextMessage';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902151;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.DataBlock, 'Message', 2) + 52) * this.DataBlock.length) + 1;
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
            buf.write(this.DataBlock[i]['Message'], pos);
            pos += this.DataBlock[i]['Message'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const count = buf.readUInt8(pos++);
        this.DataBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjDataBlock = {
                FromAgentId: UUID_1.UUID.zero(),
                ToAgentId: UUID_1.UUID.zero(),
                GlobalX: 0,
                GlobalY: 0,
                Time: 0,
                Message: ''
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
            newObjDataBlock['Message'] = buf.toString('utf8', pos, length);
            pos += length;
            this.DataBlock.push(newObjDataBlock);
        }
        return pos - startPos;
    }
}
exports.LogTextMessagePacket = LogTextMessagePacket;
//# sourceMappingURL=LogTextMessage.js.map