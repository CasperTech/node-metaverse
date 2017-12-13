"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class NetTestMessage {
    constructor() {
        this.name = 'NetTest';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.NetTest;
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
        let varLength = 0;
        const newObjNetBlock = {
            Port: 0
        };
        newObjNetBlock['Port'] = buf.readUInt16LE(pos);
        pos += 2;
        this.NetBlock = newObjNetBlock;
        return pos - startPos;
    }
}
exports.NetTestMessage = NetTestMessage;
//# sourceMappingURL=NetTest.js.map