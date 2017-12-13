"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class EconomyDataRequestMessage {
    constructor() {
        this.name = 'EconomyDataRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.EconomyDataRequest;
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
exports.EconomyDataRequestMessage = EconomyDataRequestMessage;
//# sourceMappingURL=EconomyDataRequest.js.map