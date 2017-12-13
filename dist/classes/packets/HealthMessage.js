"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class HealthMessagePacket {
    constructor() {
        this.name = 'HealthMessage';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901898;
    }
    getSize() {
        return 4;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeFloatLE(this.HealthData['Health'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjHealthData = {
            Health: 0
        };
        newObjHealthData['Health'] = buf.readFloatLE(pos);
        pos += 4;
        this.HealthData = newObjHealthData;
        return pos - startPos;
    }
}
exports.HealthMessagePacket = HealthMessagePacket;
//# sourceMappingURL=HealthMessage.js.map