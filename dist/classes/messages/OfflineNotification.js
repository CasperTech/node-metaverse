"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class OfflineNotificationMessage {
    constructor() {
        this.name = 'OfflineNotification';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.OfflineNotification;
    }
    getSize() {
        return ((16) * this.AgentBlock.length) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = this.AgentBlock.length;
        buf.writeUInt8(this.AgentBlock.length, pos++);
        for (let i = 0; i < count; i++) {
            this.AgentBlock[i]['AgentID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const count = buf.readUInt8(pos++);
        this.AgentBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjAgentBlock = {
                AgentID: UUID_1.UUID.zero()
            };
            newObjAgentBlock['AgentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.AgentBlock.push(newObjAgentBlock);
        }
        return pos - startPos;
    }
}
exports.OfflineNotificationMessage = OfflineNotificationMessage;
//# sourceMappingURL=OfflineNotification.js.map