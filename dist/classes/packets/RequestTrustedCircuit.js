"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class RequestTrustedCircuitPacket {
    constructor() {
        this.name = 'RequestTrustedCircuit';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902154;
    }
    getSize() {
        return 0;
    }
    writeToBuffer(buf, pos) {
        return 0;
    }
    readFromBuffer(buf, pos) {
        return 0;
    }
}
exports.RequestTrustedCircuitPacket = RequestTrustedCircuitPacket;
//# sourceMappingURL=RequestTrustedCircuit.js.map