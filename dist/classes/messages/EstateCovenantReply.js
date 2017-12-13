"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class EstateCovenantReplyMessage {
    constructor() {
        this.name = 'EstateCovenantReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.EstateCovenantReply;
    }
    getSize() {
        return (this.Data['EstateName'].length + 1) + 36;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Data['CovenantID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Data['CovenantTimestamp'], pos);
        pos += 4;
        buf.writeUInt8(this.Data['EstateName'].length, pos++);
        this.Data['EstateName'].copy(buf, pos);
        pos += this.Data['EstateName'].length;
        this.Data['EstateOwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjData = {
            CovenantID: UUID_1.UUID.zero(),
            CovenantTimestamp: 0,
            EstateName: Buffer.allocUnsafe(0),
            EstateOwnerID: UUID_1.UUID.zero()
        };
        newObjData['CovenantID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['CovenantTimestamp'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjData['EstateName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjData['EstateOwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.EstateCovenantReplyMessage = EstateCovenantReplyMessage;
//# sourceMappingURL=EstateCovenantReply.js.map