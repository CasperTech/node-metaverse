"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class LoadURLMessage {
    constructor() {
        this.name = 'LoadURL';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.LoadURL;
    }
    getSize() {
        return (this.Data['ObjectName'].length + 1 + this.Data['Message'].length + 1 + this.Data['URL'].length + 1) + 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.Data['ObjectName'].length, pos++);
        this.Data['ObjectName'].copy(buf, pos);
        pos += this.Data['ObjectName'].length;
        this.Data['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.Data['OwnerIsGroup']) ? 1 : 0, pos++);
        buf.writeUInt8(this.Data['Message'].length, pos++);
        this.Data['Message'].copy(buf, pos);
        pos += this.Data['Message'].length;
        buf.writeUInt8(this.Data['URL'].length, pos++);
        this.Data['URL'].copy(buf, pos);
        pos += this.Data['URL'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjData = {
            ObjectName: Buffer.allocUnsafe(0),
            ObjectID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            OwnerIsGroup: false,
            Message: Buffer.allocUnsafe(0),
            URL: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt8(pos++);
        newObjData['ObjectName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['OwnerIsGroup'] = (buf.readUInt8(pos++) === 1);
        varLength = buf.readUInt8(pos++);
        newObjData['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjData['URL'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.LoadURLMessage = LoadURLMessage;
//# sourceMappingURL=LoadURL.js.map