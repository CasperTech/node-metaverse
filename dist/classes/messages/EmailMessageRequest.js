"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class EmailMessageRequestMessage {
    constructor() {
        this.name = 'EmailMessageRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.EmailMessageRequest;
    }
    getSize() {
        return (this.DataBlock['FromAddress'].length + 1 + this.DataBlock['Subject'].length + 1) + 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.DataBlock['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.DataBlock['FromAddress'].length, pos++);
        this.DataBlock['FromAddress'].copy(buf, pos);
        pos += this.DataBlock['FromAddress'].length;
        buf.writeUInt8(this.DataBlock['Subject'].length, pos++);
        this.DataBlock['Subject'].copy(buf, pos);
        pos += this.DataBlock['Subject'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjDataBlock = {
            ObjectID: UUID_1.UUID.zero(),
            FromAddress: Buffer.allocUnsafe(0),
            Subject: Buffer.allocUnsafe(0)
        };
        newObjDataBlock['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['FromAddress'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['Subject'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.EmailMessageRequestMessage = EmailMessageRequestMessage;
//# sourceMappingURL=EmailMessageRequest.js.map