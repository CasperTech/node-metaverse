"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = require("../Vector3");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SimulatorViewerTimeMessagePacket {
    constructor() {
        this.name = 'SimulatorViewerTimeMessage';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901910;
    }
    getSize() {
        return 44;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.TimeInfo['UsecSinceStart'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.TimeInfo['UsecSinceStart'].high, pos);
        pos += 4;
        buf.writeUInt32LE(this.TimeInfo['SecPerDay'], pos);
        pos += 4;
        buf.writeUInt32LE(this.TimeInfo['SecPerYear'], pos);
        pos += 4;
        this.TimeInfo['SunDirection'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeFloatLE(this.TimeInfo['SunPhase'], pos);
        pos += 4;
        this.TimeInfo['SunAngVelocity'].writeToBuffer(buf, pos, false);
        pos += 12;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjTimeInfo = {
            UsecSinceStart: Long.ZERO,
            SecPerDay: 0,
            SecPerYear: 0,
            SunDirection: Vector3_1.Vector3.getZero(),
            SunPhase: 0,
            SunAngVelocity: Vector3_1.Vector3.getZero()
        };
        newObjTimeInfo['UsecSinceStart'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjTimeInfo['SecPerDay'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjTimeInfo['SecPerYear'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjTimeInfo['SunDirection'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjTimeInfo['SunPhase'] = buf.readFloatLE(pos);
        pos += 4;
        newObjTimeInfo['SunAngVelocity'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        this.TimeInfo = newObjTimeInfo;
        return pos - startPos;
    }
}
exports.SimulatorViewerTimeMessagePacket = SimulatorViewerTimeMessagePacket;
//# sourceMappingURL=SimulatorViewerTimeMessage.js.map