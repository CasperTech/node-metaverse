"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TeleportStartMessage {
    constructor() {
        this.name = 'TeleportStart';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TeleportStart;
    }
    getSize() {
        return 4;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.Info['TeleportFlags'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjInfo = {
            TeleportFlags: 0
        };
        newObjInfo['TeleportFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.TeleportStartMessage = TeleportStartMessage;
//# sourceMappingURL=TeleportStart.js.map