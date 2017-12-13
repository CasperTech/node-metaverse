"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RequestPayPriceMessage {
    constructor() {
        this.name = 'RequestPayPrice';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RequestPayPrice;
    }
    getSize() {
        return 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.ObjectData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjObjectData = {
            ObjectID: UUID_1.UUID.zero()
        };
        newObjObjectData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.ObjectData = newObjObjectData;
        return pos - startPos;
    }
}
exports.RequestPayPriceMessage = RequestPayPriceMessage;
//# sourceMappingURL=RequestPayPrice.js.map