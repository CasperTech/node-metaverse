"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RegionHandleRequestMessage {
    constructor() {
        this.name = 'RegionHandleRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RegionHandleRequest;
    }
    getSize() {
        return 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.RequestBlock['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjRequestBlock = {
            RegionID: UUID_1.UUID.zero()
        };
        newObjRequestBlock['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.RequestBlock = newObjRequestBlock;
        return pos - startPos;
    }
}
exports.RegionHandleRequestMessage = RegionHandleRequestMessage;
//# sourceMappingURL=RegionHandleRequest.js.map