"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class InternalScriptMailMessage {
    constructor() {
        this.name = 'InternalScriptMail';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = Message_1.Message.InternalScriptMail;
    }
    getSize() {
        return (this.DataBlock['From'].length + 1 + this.DataBlock['Subject'].length + 1 + this.DataBlock['Body'].length + 2) + 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.DataBlock['From'].length, pos++);
        this.DataBlock['From'].copy(buf, pos);
        pos += this.DataBlock['From'].length;
        this.DataBlock['To'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.DataBlock['Subject'].length, pos++);
        this.DataBlock['Subject'].copy(buf, pos);
        pos += this.DataBlock['Subject'].length;
        buf.writeUInt16LE(this.DataBlock['Body'].length, pos);
        pos += 2;
        this.DataBlock['Body'].copy(buf, pos);
        pos += this.DataBlock['Body'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjDataBlock = {
            From: Buffer.allocUnsafe(0),
            To: UUID_1.UUID.zero(),
            Subject: Buffer.allocUnsafe(0),
            Body: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['From'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjDataBlock['To'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['Subject'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjDataBlock['Body'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.InternalScriptMailMessage = InternalScriptMailMessage;
//# sourceMappingURL=InternalScriptMail.js.map