"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class NetTestPacket {
    constructor() {
        this.name = 'NetTest';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902086;
    }
    getSize() {
        return 2;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt16LE(this.NetBlock['Port'], pos);
        pos += 2;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjNetBlock = {
            Port: 0
        };
        newObjNetBlock['Port'] = buf.readUInt16LE(pos);
        pos += 2;
        this.NetBlock = newObjNetBlock;
        return pos - startPos;
    }
}
exports.NetTestPacket = NetTestPacket;
//# sourceMappingURL=NetTest.js.map