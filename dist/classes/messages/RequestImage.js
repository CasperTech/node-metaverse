"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RequestImageMessage {
    constructor() {
        this.name = 'RequestImage';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.RequestImage;
    }
    getSize() {
        return ((26) * this.RequestImage.length) + 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.RequestImage.length;
        buf.writeUInt8(this.RequestImage.length, pos++);
        for (let i = 0; i < count; i++) {
            this.RequestImage[i]['Image'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt8(this.RequestImage[i]['DiscardLevel'], pos++);
            buf.writeFloatLE(this.RequestImage[i]['DownloadPriority'], pos);
            pos += 4;
            buf.writeUInt32LE(this.RequestImage[i]['Packet'], pos);
            pos += 4;
            buf.writeUInt8(this.RequestImage[i]['Type'], pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.RequestImage = [];
        for (let i = 0; i < count; i++) {
            const newObjRequestImage = {
                Image: UUID_1.UUID.zero(),
                DiscardLevel: 0,
                DownloadPriority: 0,
                Packet: 0,
                Type: 0
            };
            newObjRequestImage['Image'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjRequestImage['DiscardLevel'] = buf.readInt8(pos++);
            newObjRequestImage['DownloadPriority'] = buf.readFloatLE(pos);
            pos += 4;
            newObjRequestImage['Packet'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjRequestImage['Type'] = buf.readUInt8(pos++);
            this.RequestImage.push(newObjRequestImage);
        }
        return pos - startPos;
    }
}
exports.RequestImageMessage = RequestImageMessage;
//# sourceMappingURL=RequestImage.js.map