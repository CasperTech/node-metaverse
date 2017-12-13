"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class UUIDGroupNameRequestMessage {
    constructor() {
        this.name = 'UUIDGroupNameRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.UUIDGroupNameRequest;
    }
    getSize() {
        return ((16) * this.UUIDNameBlock.length) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = this.UUIDNameBlock.length;
        buf.writeUInt8(this.UUIDNameBlock.length, pos++);
        for (let i = 0; i < count; i++) {
            this.UUIDNameBlock[i]['ID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const count = buf.readUInt8(pos++);
        this.UUIDNameBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjUUIDNameBlock = {
                ID: UUID_1.UUID.zero()
            };
            newObjUUIDNameBlock['ID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.UUIDNameBlock.push(newObjUUIDNameBlock);
        }
        return pos - startPos;
    }
}
exports.UUIDGroupNameRequestMessage = UUIDGroupNameRequestMessage;
//# sourceMappingURL=UUIDGroupNameRequest.js.map