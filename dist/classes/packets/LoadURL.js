"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class LoadURLPacket {
    constructor() {
        this.name = 'LoadURL';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901954;
    }
    getSize() {
        return (this.Data['ObjectName'].length + 1 + this.Data['Message'].length + 1 + this.Data['URL'].length + 1) + 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.write(this.Data['ObjectName'], pos);
        pos += this.Data['ObjectName'].length;
        this.Data['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.Data['OwnerIsGroup']) ? 1 : 0, pos++);
        buf.write(this.Data['Message'], pos);
        pos += this.Data['Message'].length;
        buf.write(this.Data['URL'], pos);
        pos += this.Data['URL'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjData = {
            ObjectName: '',
            ObjectID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            OwnerIsGroup: false,
            Message: '',
            URL: ''
        };
        newObjData['ObjectName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['OwnerIsGroup'] = (buf.readUInt8(pos++) === 1);
        newObjData['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['URL'] = buf.toString('utf8', pos, length);
        pos += length;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.LoadURLPacket = LoadURLPacket;
//# sourceMappingURL=LoadURL.js.map