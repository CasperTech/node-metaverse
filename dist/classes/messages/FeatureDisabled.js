"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class FeatureDisabledMessage {
    constructor() {
        this.name = 'FeatureDisabled';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.FeatureDisabled;
    }
    getSize() {
        return (this.FailureInfo['ErrorMessage'].length + 1) + 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.FailureInfo['ErrorMessage'].length, pos++);
        this.FailureInfo['ErrorMessage'].copy(buf, pos);
        pos += this.FailureInfo['ErrorMessage'].length;
        this.FailureInfo['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.FailureInfo['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjFailureInfo = {
            ErrorMessage: Buffer.allocUnsafe(0),
            AgentID: UUID_1.UUID.zero(),
            TransactionID: UUID_1.UUID.zero()
        };
        varLength = buf.readUInt8(pos++);
        newObjFailureInfo['ErrorMessage'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjFailureInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjFailureInfo['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.FailureInfo = newObjFailureInfo;
        return pos - startPos;
    }
}
exports.FeatureDisabledMessage = FeatureDisabledMessage;
//# sourceMappingURL=FeatureDisabled.js.map