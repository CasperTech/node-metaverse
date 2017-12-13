"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class HealthMessageMessage {
    constructor() {
        this.name = 'HealthMessage';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.HealthMessage;
    }
    getSize() {
        return 4;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeFloatLE(this.HealthData['Health'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjHealthData = {
            Health: 0
        };
        newObjHealthData['Health'] = buf.readFloatLE(pos);
        pos += 4;
        this.HealthData = newObjHealthData;
        return pos - startPos;
    }
}
exports.HealthMessageMessage = HealthMessageMessage;
//# sourceMappingURL=HealthMessage.js.map