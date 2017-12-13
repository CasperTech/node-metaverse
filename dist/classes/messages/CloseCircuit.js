"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class CloseCircuitMessage {
    constructor() {
        this.name = 'CloseCircuit';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyFixed;
        this.id = Message_1.Message.CloseCircuit;
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
exports.CloseCircuitMessage = CloseCircuitMessage;
//# sourceMappingURL=CloseCircuit.js.map