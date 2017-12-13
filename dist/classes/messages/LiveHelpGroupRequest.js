"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class LiveHelpGroupRequestMessage {
    constructor() {
        this.name = 'LiveHelpGroupRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.LiveHelpGroupRequest;
    }
    getSize() {
        return 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.RequestData['RequestID'].writeToBuffer(buf, pos);
        pos += 16;
        this.RequestData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjRequestData = {
            RequestID: UUID_1.UUID.zero(),
            AgentID: UUID_1.UUID.zero()
        };
        newObjRequestData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRequestData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.RequestData = newObjRequestData;
        return pos - startPos;
    }
}
exports.LiveHelpGroupRequestMessage = LiveHelpGroupRequestMessage;
//# sourceMappingURL=LiveHelpGroupRequest.js.map