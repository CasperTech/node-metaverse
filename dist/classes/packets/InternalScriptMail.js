"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class InternalScriptMailPacket {
    constructor() {
        this.name = 'InternalScriptMail';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = 65296;
    }
    getSize() {
        return (this.DataBlock['From'].length + 1 + this.DataBlock['Subject'].length + 1 + this.DataBlock['Body'].length + 2) + 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.write(this.DataBlock['From'], pos);
        pos += this.DataBlock['From'].length;
        this.DataBlock['To'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.DataBlock['Subject'], pos);
        pos += this.DataBlock['Subject'].length;
        buf.write(this.DataBlock['Body'], pos);
        pos += this.DataBlock['Body'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjDataBlock = {
            From: '',
            To: UUID_1.UUID.zero(),
            Subject: '',
            Body: ''
        };
        newObjDataBlock['From'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjDataBlock['To'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['Subject'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjDataBlock['Body'] = buf.toString('utf8', pos, length);
        pos += length;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.InternalScriptMailPacket = InternalScriptMailPacket;
//# sourceMappingURL=InternalScriptMail.js.map