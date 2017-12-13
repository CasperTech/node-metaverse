"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ReplyTaskInventoryPacket {
    constructor() {
        this.name = 'ReplyTaskInventory';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902050;
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
        buf.write(this.InventoryData['Filename'], pos);
        pos += this.InventoryData['Filename'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjInventoryData = {
            TaskID: UUID_1.UUID.zero(),
            Serial: 0,
            Filename: ''
        };
        newObjInventoryData['TaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['Serial'] = buf.readInt16LE(pos);
        pos += 2;
        newObjInventoryData['Filename'] = buf.toString('utf8', pos, length);
        pos += length;
        this.InventoryData = newObjInventoryData;
        return pos - startPos;
    }
}
exports.ReplyTaskInventoryPacket = ReplyTaskInventoryPacket;
//# sourceMappingURL=ReplyTaskInventory.js.map