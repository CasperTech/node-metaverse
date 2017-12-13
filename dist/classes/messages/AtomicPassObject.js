"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AtomicPassObjectMessage {
    constructor() {
        this.name = 'AtomicPassObject';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.AtomicPassObject;
    }
    getSize() {
        return 17;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.TaskData['TaskID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.TaskData['AttachmentNeedsSave']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjTaskData = {
            TaskID: UUID_1.UUID.zero(),
            AttachmentNeedsSave: false
        };
        newObjTaskData['TaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTaskData['AttachmentNeedsSave'] = (buf.readUInt8(pos++) === 1);
        this.TaskData = newObjTaskData;
        return pos - startPos;
    }
}
exports.AtomicPassObjectMessage = AtomicPassObjectMessage;
//# sourceMappingURL=AtomicPassObject.js.map