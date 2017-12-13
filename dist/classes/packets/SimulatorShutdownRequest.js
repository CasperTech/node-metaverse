"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class SimulatorShutdownRequestPacket {
    constructor() {
        this.name = 'SimulatorShutdownRequest';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901773;
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
exports.SimulatorShutdownRequestPacket = SimulatorShutdownRequestPacket;
//# sourceMappingURL=SimulatorShutdownRequest.js.map