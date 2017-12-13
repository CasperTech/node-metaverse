"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ImagePacketPacket {
    constructor() {
        this.name = 'ImagePacket';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 10;
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
        buf.write(this.ImageData['Data'], pos);
        pos += this.ImageData['Data'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
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
            Data: ''
        };
        newObjImageData['Data'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ImageData = newObjImageData;
        return pos - startPos;
    }
}
exports.ImagePacketPacket = ImagePacketPacket;
//# sourceMappingURL=ImagePacket.js.map