"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ImagePacketMessage {
    constructor() {
        this.name = 'ImagePacket';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.ImagePacket;
    }
    getSize() {
        return (this.ImageData['Data'].length + 2) + 18;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.ImageID['ID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt16LE(this.ImageID['Packet'], pos);
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
            Packet: 0
        };
        newObjImageID['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjImageID['Packet'] = buf.readUInt16LE(pos);
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
exports.ImagePacketMessage = ImagePacketMessage;
//# sourceMappingURL=ImagePacket.js.map