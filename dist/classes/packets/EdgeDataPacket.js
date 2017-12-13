"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class EdgeDataPacketPacket {
    constructor() {
        this.name = 'EdgeDataPacket';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 24;
    }
    getSize() {
        return (this.EdgeData['LayerData'].length + 2) + 2;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.EdgeData['LayerType'], pos++);
        buf.writeUInt8(this.EdgeData['Direction'], pos++);
        buf.write(this.EdgeData['LayerData'], pos);
        pos += this.EdgeData['LayerData'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjEdgeData = {
            LayerType: 0,
            Direction: 0,
            LayerData: ''
        };
        newObjEdgeData['LayerType'] = buf.readUInt8(pos++);
        newObjEdgeData['Direction'] = buf.readUInt8(pos++);
        newObjEdgeData['LayerData'] = buf.toString('utf8', pos, length);
        pos += length;
        this.EdgeData = newObjEdgeData;
        return pos - startPos;
    }
}
exports.EdgeDataPacketPacket = EdgeDataPacketPacket;
//# sourceMappingURL=EdgeDataPacket.js.map