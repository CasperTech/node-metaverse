"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ImageDataMessage {
    constructor() {
        this.name = 'ImageData';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.ImageData;
    }
    getSize() {
        return (this.ImageData['Data'].length + 2) + 23;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.ImageID['ID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ImageID['Codec'], pos++);
        buf.writeUInt32LE(this.ImageID['Size'], pos);
        pos += 4;
        buf.writeUInt16LE(this.ImageID['Packets'], pos);
        pos += 2;
        buf.writeUInt16LE(this.ImageData['Data'].length, pos);
        pos += 2;
        this.ImageData['Data'].copy(buf, pos);
        pos += this.ImageData['Data'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjImageID = {
            ID: UUID_1.UUID.zero(),
            Codec: 0,
            Size: 0,
            Packets: 0
        };
        newObjImageID['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjImageID['Codec'] = buf.readUInt8(pos++);
        newObjImageID['Size'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjImageID['Packets'] = buf.readUInt16LE(pos);
        pos += 2;
        this.ImageID = newObjImageID;
        const newObjImageData = {
            Data: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjImageData['Data'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ImageData = newObjImageData;
        return pos - startPos;
    }
}
exports.ImageDataMessage = ImageDataMessage;
//# sourceMappingURL=ImageData.js.map