"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RemoveParcelMessage {
    constructor() {
        this.name = 'RemoveParcel';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RemoveParcel;
    }
    getSize() {
        return ((16) * this.ParcelData.length) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = this.ParcelData.length;
        buf.writeUInt8(this.ParcelData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ParcelData[i]['ParcelID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const count = buf.readUInt8(pos++);
        this.ParcelData = [];
        for (let i = 0; i < count; i++) {
            const newObjParcelData = {
                ParcelID: UUID_1.UUID.zero()
            };
            newObjParcelData['ParcelID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.ParcelData.push(newObjParcelData);
        }
        return pos - startPos;
    }
}
exports.RemoveParcelMessage = RemoveParcelMessage;
//# sourceMappingURL=RemoveParcel.js.map