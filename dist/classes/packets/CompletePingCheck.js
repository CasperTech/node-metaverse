"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class CompletePingCheckPacket {
    constructor() {
        this.name = 'CompletePingCheck';
        this.flags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 2;
    }
    getSize() {
        return 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.PingID['PingID'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjPingID = {
            PingID: 0
        };
        newObjPingID['PingID'] = buf.readUInt8(pos++);
        this.PingID = newObjPingID;
        return pos - startPos;
    }
}
exports.CompletePingCheckPacket = CompletePingCheckPacket;
//# sourceMappingURL=CompletePingCheck.js.map