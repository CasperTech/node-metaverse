"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class EdgeDataPacketMessage {
    constructor() {
        this.name = 'EdgeDataPacket';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.EdgeDataPacket;
    }
    getSize() {
        return (this.EdgeData['LayerData'].length + 2) + 2;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.EdgeData['LayerType'], pos++);
        buf.writeUInt8(this.EdgeData['Direction'], pos++);
        buf.writeUInt16LE(this.EdgeData['LayerData'].length, pos);
        pos += 2;
        this.EdgeData['LayerData'].copy(buf, pos);
        pos += this.EdgeData['LayerData'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjEdgeData = {
            LayerType: 0,
            Direction: 0,
            LayerData: Buffer.allocUnsafe(0)
        };
        newObjEdgeData['LayerType'] = buf.readUInt8(pos++);
        newObjEdgeData['Direction'] = buf.readUInt8(pos++);
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjEdgeData['LayerData'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.EdgeData = newObjEdgeData;
        return pos - startPos;
    }
}
exports.EdgeDataPacketMessage = EdgeDataPacketMessage;
//# sourceMappingURL=EdgeDataPacket.js.map