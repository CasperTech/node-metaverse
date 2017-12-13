"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AckHandler {
    static receivedAck(ackID) {
    }
    static sendAck(ackID) {
        this.acksToSend.push(ackID);
    }
}
AckHandler.acksToSend = [];
exports.AckHandler = AckHandler;
//# sourceMappingURL=AckHandler.js.map