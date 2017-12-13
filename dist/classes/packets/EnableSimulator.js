"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPAddress_1 = require("../IPAddress");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class EnableSimulatorPacket {
    constructor() {
        this.name = 'EnableSimulator';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Blacklisted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901911;
    }
    getSize() {
        return 14;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.SimulatorInfo['Handle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.SimulatorInfo['Handle'].high, pos);
        pos += 4;
        this.SimulatorInfo['IP'].writeToBuffer(buf, pos);
        pos += 4;
        buf.writeUInt16LE(this.SimulatorInfo['Port'], pos);
        pos += 2;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjSimulatorInfo = {
            Handle: Long.ZERO,
            IP: IPAddress_1.IPAddress.zero(),
            Port: 0
        };
        newObjSimulatorInfo['Handle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjSimulatorInfo['IP'] = new IPAddress_1.IPAddress(buf, pos);
        pos += 4;
        newObjSimulatorInfo['Port'] = buf.readUInt16LE(pos);
        pos += 2;
        this.SimulatorInfo = newObjSimulatorInfo;
        return pos - startPos;
    }
}
exports.EnableSimulatorPacket = EnableSimulatorPacket;
//# sourceMappingURL=EnableSimulator.js.map