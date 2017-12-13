"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class FeatureDisabledPacket {
    constructor() {
        this.name = 'FeatureDisabled';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901779;
    }
    getSize() {
        return (this.FailureInfo['ErrorMessage'].length + 1) + 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.write(this.FailureInfo['ErrorMessage'], pos);
        pos += this.FailureInfo['ErrorMessage'].length;
        this.FailureInfo['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.FailureInfo['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjFailureInfo = {
            ErrorMessage: '',
            AgentID: UUID_1.UUID.zero(),
            TransactionID: UUID_1.UUID.zero()
        };
        newObjFailureInfo['ErrorMessage'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjFailureInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjFailureInfo['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.FailureInfo = newObjFailureInfo;
        return pos - startPos;
    }
}
exports.FeatureDisabledPacket = FeatureDisabledPacket;
//# sourceMappingURL=FeatureDisabled.js.map