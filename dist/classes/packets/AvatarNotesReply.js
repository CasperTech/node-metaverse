"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AvatarNotesReplyPacket {
    constructor() {
        this.name = 'AvatarNotesReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901936;
    }
    getSize() {
        return (this.Data['Notes'].length + 2) + 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['TargetID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.Data['Notes'], pos);
        pos += this.Data['Notes'].length;
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
        const newObjData = {
            TargetID: UUID_1.UUID.zero(),
            Notes: ''
        };
        newObjData['TargetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['Notes'] = buf.toString('utf8', pos, length);
        pos += length;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.AvatarNotesReplyPacket = AvatarNotesReplyPacket;
//# sourceMappingURL=AvatarNotesReply.js.map