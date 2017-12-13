"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class UUIDNameReplyPacket {
    constructor() {
        this.name = 'UUIDNameReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901996;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.UUIDNameBlock, 'FirstName', 1) + this.calculateVarVarSize(this.UUIDNameBlock, 'LastName', 1) + 16) * this.UUIDNameBlock.length) + 1;
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
        const count = this.UUIDNameBlock.length;
        buf.writeUInt8(this.UUIDNameBlock.length, pos++);
        for (let i = 0; i < count; i++) {
            this.UUIDNameBlock[i]['ID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.write(this.UUIDNameBlock[i]['FirstName'], pos);
            pos += this.UUIDNameBlock[i]['FirstName'].length;
            buf.write(this.UUIDNameBlock[i]['LastName'], pos);
            pos += this.UUIDNameBlock[i]['LastName'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const count = buf.readUInt8(pos++);
        this.UUIDNameBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjUUIDNameBlock = {
                ID: UUID_1.UUID.zero(),
                FirstName: '',
                LastName: ''
            };
            newObjUUIDNameBlock['ID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjUUIDNameBlock['FirstName'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjUUIDNameBlock['LastName'] = buf.toString('utf8', pos, length);
            pos += length;
            this.UUIDNameBlock.push(newObjUUIDNameBlock);
        }
        return pos - startPos;
    }
}
exports.UUIDNameReplyPacket = UUIDNameReplyPacket;
//# sourceMappingURL=UUIDNameReply.js.map