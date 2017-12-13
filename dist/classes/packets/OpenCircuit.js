"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPAddress_1 = require("../IPAddress");
const MessageFlags_1 = require("../../enums/MessageFlags");
class OpenCircuitPacket {
    constructor() {
        this.name = 'OpenCircuit';
        this.flags = MessageFlags_1.MessageFlags.Blacklisted | MessageFlags_1.MessageFlags.FrequencyFixed;
        this.id = 4294967292;
    }
    getSize() {
        return 6;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.CircuitInfo['IP'].writeToBuffer(buf, pos);
        pos += 4;
        buf.writeUInt16LE(this.CircuitInfo['Port'], pos);
        pos += 2;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjCircuitInfo = {
            IP: IPAddress_1.IPAddress.zero(),
            Port: 0
        };
        newObjCircuitInfo['IP'] = new IPAddress_1.IPAddress(buf, pos);
        pos += 4;
        newObjCircuitInfo['Port'] = buf.readUInt16LE(pos);
        pos += 2;
        this.CircuitInfo = newObjCircuitInfo;
        return pos - startPos;
    }
}
exports.OpenCircuitPacket = OpenCircuitPacket;
//# sourceMappingURL=OpenCircuit.js.map