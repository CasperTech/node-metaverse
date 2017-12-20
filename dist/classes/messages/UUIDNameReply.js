"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class UUIDNameReplyMessage {
    constructor() {
        this.name = 'UUIDNameReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.UUIDNameReply;
    }
    getSize() {
        return this.calculateVarVarSize(this.UUIDNameBlock, 'FirstName', 1) + this.calculateVarVarSize(this.UUIDNameBlock, 'LastName', 1) + ((16) * this.UUIDNameBlock.length) + 1;
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
            buf.writeUInt8(this.UUIDNameBlock[i]['FirstName'].length, pos++);
            this.UUIDNameBlock[i]['FirstName'].copy(buf, pos);
            pos += this.UUIDNameBlock[i]['FirstName'].length;
            buf.writeUInt8(this.UUIDNameBlock[i]['LastName'].length, pos++);
            this.UUIDNameBlock[i]['LastName'].copy(buf, pos);
            pos += this.UUIDNameBlock[i]['LastName'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const count = buf.readUInt8(pos++);
        this.UUIDNameBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjUUIDNameBlock = {
                ID: UUID_1.UUID.zero(),
                FirstName: Buffer.allocUnsafe(0),
                LastName: Buffer.allocUnsafe(0)
            };
            newObjUUIDNameBlock['ID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjUUIDNameBlock['FirstName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjUUIDNameBlock['LastName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.UUIDNameBlock.push(newObjUUIDNameBlock);
        }
        return pos - startPos;
    }
}
exports.UUIDNameReplyMessage = UUIDNameReplyMessage;
//# sourceMappingURL=UUIDNameReply.js.map