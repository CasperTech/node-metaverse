"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TeleportProgressMessage {
    constructor() {
        this.name = 'TeleportProgress';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TeleportProgress;
    }
    getSize() {
        return (this.Info['Message'].length + 1) + 20;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Info['TeleportFlags'], pos);
        pos += 4;
        buf.writeUInt8(this.Info['Message'].length, pos++);
        this.Info['Message'].copy(buf, pos);
        pos += this.Info['Message'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjInfo = {
            TeleportFlags: 0,
            Message: Buffer.allocUnsafe(0)
        };
        newObjInfo['TeleportFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjInfo['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.TeleportProgressMessage = TeleportProgressMessage;
//# sourceMappingURL=TeleportProgress.js.map