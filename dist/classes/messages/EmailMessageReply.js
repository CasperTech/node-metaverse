"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class EmailMessageReplyMessage {
    constructor() {
        this.name = 'EmailMessageReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.EmailMessageReply;
    }
    getSize() {
        return (this.DataBlock['FromAddress'].length + 1 + this.DataBlock['Subject'].length + 1 + this.DataBlock['Data'].length + 2 + this.DataBlock['MailFilter'].length + 1) + 24;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.DataBlock['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.DataBlock['More'], pos);
        pos += 4;
        buf.writeUInt32LE(this.DataBlock['Time'], pos);
        pos += 4;
        buf.writeUInt8(this.DataBlock['FromAddress'].length, pos++);
        this.DataBlock['FromAddress'].copy(buf, pos);
        pos += this.DataBlock['FromAddress'].length;
        buf.writeUInt8(this.DataBlock['Subject'].length, pos++);
        this.DataBlock['Subject'].copy(buf, pos);
        pos += this.DataBlock['Subject'].length;
        buf.writeUInt16LE(this.DataBlock['Data'].length, pos);
        pos += 2;
        this.DataBlock['Data'].copy(buf, pos);
        pos += this.DataBlock['Data'].length;
        buf.writeUInt8(this.DataBlock['MailFilter'].length, pos++);
        this.DataBlock['MailFilter'].copy(buf, pos);
        pos += this.DataBlock['MailFilter'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjDataBlock = {
            ObjectID: UUID_1.UUID.zero(),
            More: 0,
            Time: 0,
            FromAddress: Buffer.allocUnsafe(0),
            Subject: Buffer.allocUnsafe(0),
            Data: Buffer.allocUnsafe(0),
            MailFilter: Buffer.allocUnsafe(0)
        };
        newObjDataBlock['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['More'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjDataBlock['Time'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['FromAddress'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['Subject'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjDataBlock['Data'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['MailFilter'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.EmailMessageReplyMessage = EmailMessageReplyMessage;
//# sourceMappingURL=EmailMessageReply.js.map