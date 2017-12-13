"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class DetachAttachmentIntoInvMessage {
    constructor() {
        this.name = 'DetachAttachmentIntoInv';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.DetachAttachmentIntoInv;
    }
    getSize() {
        return 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.ObjectData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ObjectData['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjObjectData = {
            AgentID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero()
        };
        newObjObjectData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjObjectData['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.ObjectData = newObjObjectData;
        return pos - startPos;
    }
}
exports.DetachAttachmentIntoInvMessage = DetachAttachmentIntoInvMessage;
//# sourceMappingURL=DetachAttachmentIntoInv.js.map