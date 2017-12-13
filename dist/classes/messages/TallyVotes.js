"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TallyVotesMessage {
    constructor() {
        this.name = 'TallyVotes';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TallyVotes;
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
exports.TallyVotesMessage = TallyVotesMessage;
//# sourceMappingURL=TallyVotes.js.map