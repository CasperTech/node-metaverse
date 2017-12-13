"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TeleportProgressPacket {
    constructor() {
        this.name = 'TeleportProgress';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901826;
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
        buf.write(this.Info['Message'], pos);
        pos += this.Info['Message'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjInfo = {
            TeleportFlags: 0,
            Message: ''
        };
        newObjInfo['TeleportFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInfo['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.TeleportProgressPacket = TeleportProgressPacket;
//# sourceMappingURL=TeleportProgress.js.map