"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class LayerDataMessage {
    constructor() {
        this.name = 'LayerData';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.LayerData;
    }
    getSize() {
        return (this.LayerData['Data'].length + 2) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.LayerID['Type'], pos++);
        buf.writeUInt16LE(this.LayerData['Data'].length, pos);
        pos += 2;
        this.LayerData['Data'].copy(buf, pos);
        pos += this.LayerData['Data'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjLayerID = {
            Type: 0
        };
        newObjLayerID['Type'] = buf.readUInt8(pos++);
        this.LayerID = newObjLayerID;
        const newObjLayerData = {
            Data: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjLayerData['Data'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.LayerData = newObjLayerData;
        return pos - startPos;
    }
}
exports.LayerDataMessage = LayerDataMessage;
//# sourceMappingURL=LayerData.js.map