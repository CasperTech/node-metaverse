"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class CompletePingCheckMessage {
    constructor() {
        this.name = 'CompletePingCheck';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.CompletePingCheck;
    }
    getSize() {
        return 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.PingID['PingID'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjPingID = {
            PingID: 0
        };
        newObjPingID['PingID'] = buf.readUInt8(pos++);
        this.PingID = newObjPingID;
        return pos - startPos;
    }
}
exports.CompletePingCheckMessage = CompletePingCheckMessage;
//# sourceMappingURL=CompletePingCheck.js.map