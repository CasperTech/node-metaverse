"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class EmailMessageReplyPacket {
    constructor() {
        this.name = 'EmailMessageReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902096;
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
        buf.write(this.DataBlock['FromAddress'], pos);
        pos += this.DataBlock['FromAddress'].length;
        buf.write(this.DataBlock['Subject'], pos);
        pos += this.DataBlock['Subject'].length;
        buf.write(this.DataBlock['Data'], pos);
        pos += this.DataBlock['Data'].length;
        buf.write(this.DataBlock['MailFilter'], pos);
        pos += this.DataBlock['MailFilter'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjDataBlock = {
            ObjectID: UUID_1.UUID.zero(),
            More: 0,
            Time: 0,
            FromAddress: '',
            Subject: '',
            Data: '',
            MailFilter: ''
        };
        newObjDataBlock['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['More'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjDataBlock['Time'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjDataBlock['FromAddress'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjDataBlock['Subject'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjDataBlock['Data'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjDataBlock['MailFilter'] = buf.toString('utf8', pos, length);
        pos += length;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.EmailMessageReplyPacket = EmailMessageReplyPacket;
//# sourceMappingURL=EmailMessageReply.js.map