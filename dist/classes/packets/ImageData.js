"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ImageDataPacket {
    constructor() {
        this.name = 'ImageData';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 9;
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
        buf.write(this.ImageData['Data'], pos);
        pos += this.ImageData['Data'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
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
            Data: ''
        };
        newObjImageData['Data'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ImageData = newObjImageData;
        return pos - startPos;
    }
}
exports.ImageDataPacket = ImageDataPacket;
//# sourceMappingURL=ImageData.js.map