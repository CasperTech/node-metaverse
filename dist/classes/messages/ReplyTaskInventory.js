"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ReplyTaskInventoryMessage {
    constructor() {
        this.name = 'ReplyTaskInventory';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ReplyTaskInventory;
    }
    getSize() {
        return (this.InventoryData['Filename'].length + 1) + 18;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.InventoryData['TaskID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt16LE(this.InventoryData['Serial'], pos);
        pos += 2;
        buf.writeUInt8(this.InventoryData['Filename'].length, pos++);
        this.InventoryData['Filename'].copy(buf, pos);
        pos += this.InventoryData['Filename'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjInventoryData = {
            TaskID: UUID_1.UUID.zero(),
            Serial: 0,
            Filename: Buffer.allocUnsafe(0)
        };
        newObjInventoryData['TaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['Serial'] = buf.readInt16LE(pos);
        pos += 2;
        varLength = buf.readUInt8(pos++);
        newObjInventoryData['Filename'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.InventoryData = newObjInventoryData;
        return pos - startPos;
    }
}
exports.ReplyTaskInventoryMessage = ReplyTaskInventoryMessage;
//# sourceMappingURL=ReplyTaskInventory.js.map