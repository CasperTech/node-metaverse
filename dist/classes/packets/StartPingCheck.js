"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class StartPingCheckPacket {
    constructor() {
        this.name = 'StartPingCheck';
        this.flags = MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 1;
    }
    getSize() {
        return 5;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.PingID['PingID'], pos++);
        buf.writeUInt32LE(this.PingID['OldestUnacked'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjPingID = {
            PingID: 0,
            OldestUnacked: 0
        };
        newObjPingID['PingID'] = buf.readUInt8(pos++);
        newObjPingID['OldestUnacked'] = buf.readUInt32LE(pos);
        pos += 4;
        this.PingID = newObjPingID;
        return pos - startPos;
    }
}
exports.StartPingCheckPacket = StartPingCheckPacket;
//# sourceMappingURL=StartPingCheck.js.map