"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class CloseCircuitPacket {
    constructor() {
        this.name = 'CloseCircuit';
        this.flags = MessageFlags_1.MessageFlags.FrequencyFixed;
        this.id = 4294967293;
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
exports.CloseCircuitPacket = CloseCircuitPacket;
//# sourceMappingURL=CloseCircuit.js.map