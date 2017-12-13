"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class FormFriendshipMessage {
    constructor() {
        this.name = 'FormFriendship';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.FormFriendship;
    }
    getSize() {
        return 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentBlock['SourceID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentBlock['DestID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentBlock = {
            SourceID: UUID_1.UUID.zero(),
            DestID: UUID_1.UUID.zero()
        };
        newObjAgentBlock['SourceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentBlock['DestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentBlock = newObjAgentBlock;
        return pos - startPos;
    }
}
exports.FormFriendshipMessage = FormFriendshipMessage;
//# sourceMappingURL=FormFriendship.js.map