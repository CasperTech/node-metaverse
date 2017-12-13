"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class LogDwellTimeMessage {
    constructor() {
        this.name = 'LogDwellTime';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.LogDwellTime;
    }
    getSize() {
        return (this.DwellInfo['SimName'].length + 1) + 46;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.DwellInfo['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.DwellInfo['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeFloatLE(this.DwellInfo['Duration'], pos);
        pos += 4;
        buf.writeUInt8(this.DwellInfo['SimName'].length, pos++);
        this.DwellInfo['SimName'].copy(buf, pos);
        pos += this.DwellInfo['SimName'].length;
        buf.writeUInt32LE(this.DwellInfo['RegionX'], pos);
        pos += 4;
        buf.writeUInt32LE(this.DwellInfo['RegionY'], pos);
        pos += 4;
        buf.writeUInt8(this.DwellInfo['AvgAgentsInView'], pos++);
        buf.writeUInt8(this.DwellInfo['AvgViewerFPS'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjDwellInfo = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            Duration: 0,
            SimName: Buffer.allocUnsafe(0),
            RegionX: 0,
            RegionY: 0,
            AvgAgentsInView: 0,
            AvgViewerFPS: 0
        };
        newObjDwellInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDwellInfo['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDwellInfo['Duration'] = buf.readFloatLE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjDwellInfo['SimName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjDwellInfo['RegionX'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjDwellInfo['RegionY'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjDwellInfo['AvgAgentsInView'] = buf.readUInt8(pos++);
        newObjDwellInfo['AvgViewerFPS'] = buf.readUInt8(pos++);
        this.DwellInfo = newObjDwellInfo;
        return pos - startPos;
    }
}
exports.LogDwellTimeMessage = LogDwellTimeMessage;
//# sourceMappingURL=LogDwellTime.js.map