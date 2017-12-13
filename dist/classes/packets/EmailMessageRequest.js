"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class EmailMessageRequestPacket {
    constructor() {
        this.name = 'EmailMessageRequest';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902095;
    }
    getSize() {
        return (this.DataBlock['FromAddress'].length + 1 + this.DataBlock['Subject'].length + 1) + 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.DataBlock['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.DataBlock['FromAddress'], pos);
        pos += this.DataBlock['FromAddress'].length;
        buf.write(this.DataBlock['Subject'], pos);
        pos += this.DataBlock['Subject'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjDataBlock = {
            ObjectID: UUID_1.UUID.zero(),
            FromAddress: '',
            Subject: ''
        };
        newObjDataBlock['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['FromAddress'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjDataBlock['Subject'] = buf.toString('utf8', pos, length);
        pos += length;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.EmailMessageRequestPacket = EmailMessageRequestPacket;
//# sourceMappingURL=EmailMessageRequest.js.map