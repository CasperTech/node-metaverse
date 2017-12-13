"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class LayerDataPacket {
    constructor() {
        this.name = 'LayerData';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 11;
    }
    getSize() {
        return (this.LayerData['Data'].length + 2) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.LayerID['Type'], pos++);
        buf.write(this.LayerData['Data'], pos);
        pos += this.LayerData['Data'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjLayerID = {
            Type: 0
        };
        newObjLayerID['Type'] = buf.readUInt8(pos++);
        this.LayerID = newObjLayerID;
        const newObjLayerData = {
            Data: ''
        };
        newObjLayerData['Data'] = buf.toString('utf8', pos, length);
        pos += length;
        this.LayerData = newObjLayerData;
        return pos - startPos;
    }
}
exports.LayerDataPacket = LayerDataPacket;
//# sourceMappingURL=LayerData.js.map