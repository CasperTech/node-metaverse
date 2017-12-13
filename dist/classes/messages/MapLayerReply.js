"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class MapLayerReplyMessage {
    constructor() {
        this.name = 'MapLayerReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.MapLayerReply;
    }
    getSize() {
        return ((32) * this.LayerData.length) + 21;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['Flags'], pos);
        pos += 4;
        const count = this.LayerData.length;
        buf.writeUInt8(this.LayerData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.LayerData[i]['Left'], pos);
            pos += 4;
            buf.writeUInt32LE(this.LayerData[i]['Right'], pos);
            pos += 4;
            buf.writeUInt32LE(this.LayerData[i]['Top'], pos);
            pos += 4;
            buf.writeUInt32LE(this.LayerData[i]['Bottom'], pos);
            pos += 4;
            this.LayerData[i]['ImageID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            Flags: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.LayerData = [];
        for (let i = 0; i < count; i++) {
            const newObjLayerData = {
                Left: 0,
                Right: 0,
                Top: 0,
                Bottom: 0,
                ImageID: UUID_1.UUID.zero()
            };
            newObjLayerData['Left'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjLayerData['Right'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjLayerData['Top'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjLayerData['Bottom'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjLayerData['ImageID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.LayerData.push(newObjLayerData);
        }
        return pos - startPos;
    }
}
exports.MapLayerReplyMessage = MapLayerReplyMessage;
//# sourceMappingURL=MapLayerReply.js.map