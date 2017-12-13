"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class EconomyDataRequestPacket {
    constructor() {
        this.name = 'EconomyDataRequest';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901784;
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
exports.EconomyDataRequestPacket = EconomyDataRequestPacket;
//# sourceMappingURL=EconomyDataRequest.js.map