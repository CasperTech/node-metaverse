"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class LiveHelpGroupRequestPacket {
    constructor() {
        this.name = 'LiveHelpGroupRequest';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902139;
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
exports.LiveHelpGroupRequestPacket = LiveHelpGroupRequestPacket;
//# sourceMappingURL=LiveHelpGroupRequest.js.map