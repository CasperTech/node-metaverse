"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ViewerFrozenMessageMessage {
    constructor() {
        this.name = 'ViewerFrozenMessage';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ViewerFrozenMessage;
    }
    getSize() {
        return 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8((this.FrozenData['Data']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjFrozenData = {
            Data: false
        };
        newObjFrozenData['Data'] = (buf.readUInt8(pos++) === 1);
        this.FrozenData = newObjFrozenData;
        return pos - startPos;
    }
}
exports.ViewerFrozenMessageMessage = ViewerFrozenMessageMessage;
//# sourceMappingURL=ViewerFrozenMessage.js.map