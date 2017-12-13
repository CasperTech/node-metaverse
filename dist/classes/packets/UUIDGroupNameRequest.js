"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class UUIDGroupNameRequestPacket {
    constructor() {
        this.name = 'UUIDGroupNameRequest';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901997;
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
exports.UUIDGroupNameRequestPacket = UUIDGroupNameRequestPacket;
//# sourceMappingURL=UUIDGroupNameRequest.js.map