"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TeleportLureRequestMessage {
    constructor() {
        this.name = 'TeleportLureRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TeleportLureRequest;
    }
    getSize() {
        return 52;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Info['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Info['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Info['LureID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Info['TeleportFlags'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjInfo = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            LureID: UUID_1.UUID.zero(),
            TeleportFlags: 0
        };
        newObjInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['LureID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['TeleportFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.TeleportLureRequestMessage = TeleportLureRequestMessage;
//# sourceMappingURL=TeleportLureRequest.js.map