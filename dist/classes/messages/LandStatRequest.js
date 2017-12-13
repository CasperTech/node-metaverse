"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class LandStatRequestMessage {
    constructor() {
        this.name = 'LandStatRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.LandStatRequest;
    }
    getSize() {
        return (this.RequestData['Filter'].length + 1) + 44;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.RequestData['ReportType'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RequestData['RequestFlags'], pos);
        pos += 4;
        buf.writeUInt8(this.RequestData['Filter'].length, pos++);
        this.RequestData['Filter'].copy(buf, pos);
        pos += this.RequestData['Filter'].length;
        buf.writeInt32LE(this.RequestData['ParcelLocalID'], pos);
        pos += 4;
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
        const newObjRequestData = {
            ReportType: 0,
            RequestFlags: 0,
            Filter: Buffer.allocUnsafe(0),
            ParcelLocalID: 0
        };
        newObjRequestData['ReportType'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRequestData['RequestFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjRequestData['Filter'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjRequestData['ParcelLocalID'] = buf.readInt32LE(pos);
        pos += 4;
        this.RequestData = newObjRequestData;
        return pos - startPos;
    }
}
exports.LandStatRequestMessage = LandStatRequestMessage;
//# sourceMappingURL=LandStatRequest.js.map