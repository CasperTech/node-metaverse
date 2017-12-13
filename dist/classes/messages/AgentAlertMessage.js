"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AgentAlertMessageMessage {
    constructor() {
        this.name = 'AgentAlertMessage';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AgentAlertMessage;
    }
    getSize() {
        return (this.AlertData['Message'].length + 1) + 17;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.AlertData['Modal']) ? 1 : 0, pos++);
        buf.writeUInt8(this.AlertData['Message'].length, pos++);
        this.AlertData['Message'].copy(buf, pos);
        pos += this.AlertData['Message'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjAlertData = {
            Modal: false,
            Message: Buffer.allocUnsafe(0)
        };
        newObjAlertData['Modal'] = (buf.readUInt8(pos++) === 1);
        varLength = buf.readUInt8(pos++);
        newObjAlertData['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.AlertData = newObjAlertData;
        return pos - startPos;
    }
}
exports.AgentAlertMessageMessage = AgentAlertMessageMessage;
//# sourceMappingURL=AgentAlertMessage.js.map