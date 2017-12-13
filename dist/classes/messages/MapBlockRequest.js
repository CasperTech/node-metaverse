"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class MapBlockRequestMessage {
    constructor() {
        this.name = 'MapBlockRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.MapBlockRequest;
    }
    getSize() {
        return 49;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['Flags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.AgentData['EstateID'], pos);
        pos += 4;
        buf.writeUInt8((this.AgentData['Godlike']) ? 1 : 0, pos++);
        buf.writeUInt16LE(this.PositionData['MinX'], pos);
        pos += 2;
        buf.writeUInt16LE(this.PositionData['MaxX'], pos);
        pos += 2;
        buf.writeUInt16LE(this.PositionData['MinY'], pos);
        pos += 2;
        buf.writeUInt16LE(this.PositionData['MaxY'], pos);
        pos += 2;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            Flags: 0,
            EstateID: 0,
            Godlike: false
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['EstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['Godlike'] = (buf.readUInt8(pos++) === 1);
        this.AgentData = newObjAgentData;
        const newObjPositionData = {
            MinX: 0,
            MaxX: 0,
            MinY: 0,
            MaxY: 0
        };
        newObjPositionData['MinX'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjPositionData['MaxX'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjPositionData['MinY'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjPositionData['MaxY'] = buf.readUInt16LE(pos);
        pos += 2;
        this.PositionData = newObjPositionData;
        return pos - startPos;
    }
}
exports.MapBlockRequestMessage = MapBlockRequestMessage;
//# sourceMappingURL=MapBlockRequest.js.map