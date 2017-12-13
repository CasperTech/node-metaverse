"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RequestXferMessage {
    constructor() {
        this.name = 'RequestXfer';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RequestXfer;
    }
    getSize() {
        return (this.XferID['Filename'].length + 1) + 29;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.XferID['ID'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.XferID['ID'].high, pos);
        pos += 4;
        buf.writeUInt8(this.XferID['Filename'].length, pos++);
        this.XferID['Filename'].copy(buf, pos);
        pos += this.XferID['Filename'].length;
        buf.writeUInt8(this.XferID['FilePath'], pos++);
        buf.writeUInt8((this.XferID['DeleteOnCompletion']) ? 1 : 0, pos++);
        buf.writeUInt8((this.XferID['UseBigPackets']) ? 1 : 0, pos++);
        this.XferID['VFileID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt16LE(this.XferID['VFileType'], pos);
        pos += 2;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjXferID = {
            ID: Long.ZERO,
            Filename: Buffer.allocUnsafe(0),
            FilePath: 0,
            DeleteOnCompletion: false,
            UseBigPackets: false,
            VFileID: UUID_1.UUID.zero(),
            VFileType: 0
        };
        newObjXferID['ID'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        varLength = buf.readUInt8(pos++);
        newObjXferID['Filename'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjXferID['FilePath'] = buf.readUInt8(pos++);
        newObjXferID['DeleteOnCompletion'] = (buf.readUInt8(pos++) === 1);
        newObjXferID['UseBigPackets'] = (buf.readUInt8(pos++) === 1);
        newObjXferID['VFileID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjXferID['VFileType'] = buf.readInt16LE(pos);
        pos += 2;
        this.XferID = newObjXferID;
        return pos - startPos;
    }
}
exports.RequestXferMessage = RequestXferMessage;
//# sourceMappingURL=RequestXfer.js.map