"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPAddress_1 = require("../IPAddress");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class OpenCircuitMessage {
    constructor() {
        this.name = 'OpenCircuit';
        this.messageFlags = MessageFlags_1.MessageFlags.Blacklisted | MessageFlags_1.MessageFlags.FrequencyFixed;
        this.id = Message_1.Message.OpenCircuit;
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
        let varLength = 0;
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
exports.OpenCircuitMessage = OpenCircuitMessage;
//# sourceMappingURL=OpenCircuit.js.map