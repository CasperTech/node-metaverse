"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class SimulatorMapUpdatePacket {
    constructor() {
        this.name = 'SimulatorMapUpdate';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901765;
    }
    getSize() {
        return 4;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.MapData['Flags'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjMapData = {
            Flags: 0
        };
        newObjMapData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.MapData = newObjMapData;
        return pos - startPos;
    }
}
exports.SimulatorMapUpdatePacket = SimulatorMapUpdatePacket;
//# sourceMappingURL=SimulatorMapUpdate.js.map