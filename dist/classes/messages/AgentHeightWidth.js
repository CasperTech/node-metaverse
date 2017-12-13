"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AgentHeightWidthMessage {
    constructor() {
        this.name = 'AgentHeightWidth';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AgentHeightWidth;
    }
    getSize() {
        return 44;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['CircuitCode'], pos);
        pos += 4;
        buf.writeUInt32LE(this.HeightWidthBlock['GenCounter'], pos);
        pos += 4;
        buf.writeUInt16LE(this.HeightWidthBlock['Height'], pos);
        pos += 2;
        buf.writeUInt16LE(this.HeightWidthBlock['Width'], pos);
        pos += 2;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            CircuitCode: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['CircuitCode'] = buf.readUInt32LE(pos);
        pos += 4;
        this.AgentData = newObjAgentData;
        const newObjHeightWidthBlock = {
            GenCounter: 0,
            Height: 0,
            Width: 0
        };
        newObjHeightWidthBlock['GenCounter'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjHeightWidthBlock['Height'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjHeightWidthBlock['Width'] = buf.readUInt16LE(pos);
        pos += 2;
        this.HeightWidthBlock = newObjHeightWidthBlock;
        return pos - startPos;
    }
}
exports.AgentHeightWidthMessage = AgentHeightWidthMessage;
//# sourceMappingURL=AgentHeightWidth.js.map