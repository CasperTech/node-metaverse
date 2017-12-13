"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DetachAttachmentIntoInvPacket {
    constructor() {
        this.name = 'DetachAttachmentIntoInv';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902157;
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
exports.DetachAttachmentIntoInvPacket = DetachAttachmentIntoInvPacket;
//# sourceMappingURL=DetachAttachmentIntoInv.js.map