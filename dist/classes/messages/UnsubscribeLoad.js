"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class UnsubscribeLoadMessage {
    constructor() {
        this.name = 'UnsubscribeLoad';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.UnsubscribeLoad;
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
exports.UnsubscribeLoadMessage = UnsubscribeLoadMessage;
//# sourceMappingURL=UnsubscribeLoad.js.map