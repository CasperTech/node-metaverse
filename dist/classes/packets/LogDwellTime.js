"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class LogDwellTimePacket {
    constructor() {
        this.name = 'LogDwellTime';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901778;
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
        buf.write(this.DwellInfo['SimName'], pos);
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
        const newObjDwellInfo = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            Duration: 0,
            SimName: '',
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
        newObjDwellInfo['SimName'] = buf.toString('utf8', pos, length);
        pos += length;
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
exports.LogDwellTimePacket = LogDwellTimePacket;
//# sourceMappingURL=LogDwellTime.js.map