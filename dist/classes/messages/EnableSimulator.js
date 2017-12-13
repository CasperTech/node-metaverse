"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPAddress_1 = require("../IPAddress");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class EnableSimulatorMessage {
    constructor() {
        this.name = 'EnableSimulator';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Blacklisted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.EnableSimulator;
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
        let varLength = 0;
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
exports.EnableSimulatorMessage = EnableSimulatorMessage;
//# sourceMappingURL=EnableSimulator.js.map