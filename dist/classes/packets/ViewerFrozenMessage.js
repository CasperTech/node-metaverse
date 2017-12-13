"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class ViewerFrozenMessagePacket {
    constructor() {
        this.name = 'ViewerFrozenMessage';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901897;
    }
    getSize() {
        return 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8((this.FrozenData['Data']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjFrozenData = {
            Data: false
        };
        newObjFrozenData['Data'] = (buf.readUInt8(pos++) === 1);
        this.FrozenData = newObjFrozenData;
        return pos - startPos;
    }
}
exports.ViewerFrozenMessagePacket = ViewerFrozenMessagePacket;
//# sourceMappingURL=ViewerFrozenMessage.js.map