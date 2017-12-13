"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ParcelDwellReplyMessage {
    constructor() {
        this.name = 'ParcelDwellReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ParcelDwellReply;
    }
    getSize() {
        return 40;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.Data['LocalID'], pos);
        pos += 4;
        this.Data['ParcelID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeFloatLE(this.Data['Dwell'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjData = {
            LocalID: 0,
            ParcelID: UUID_1.UUID.zero(),
            Dwell: 0
        };
        newObjData['LocalID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['ParcelID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['Dwell'] = buf.readFloatLE(pos);
        pos += 4;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.ParcelDwellReplyMessage = ParcelDwellReplyMessage;
//# sourceMappingURL=ParcelDwellReply.js.map