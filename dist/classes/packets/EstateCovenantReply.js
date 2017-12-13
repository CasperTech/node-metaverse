"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class EstateCovenantReplyPacket {
    constructor() {
        this.name = 'EstateCovenantReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901964;
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
        buf.write(this.Data['EstateName'], pos);
        pos += this.Data['EstateName'].length;
        this.Data['EstateOwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjData = {
            CovenantID: UUID_1.UUID.zero(),
            CovenantTimestamp: 0,
            EstateName: '',
            EstateOwnerID: UUID_1.UUID.zero()
        };
        newObjData['CovenantID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['CovenantTimestamp'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjData['EstateName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['EstateOwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.EstateCovenantReplyPacket = EstateCovenantReplyPacket;
//# sourceMappingURL=EstateCovenantReply.js.map