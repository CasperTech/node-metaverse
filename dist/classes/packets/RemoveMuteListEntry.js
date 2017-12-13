"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RemoveMuteListEntryPacket {
    constructor() {
        this.name = 'RemoveMuteListEntry';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902024;
    }
    getSize() {
        return (this.MuteData['MuteName'].length + 1) + 48;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.MuteData['MuteID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.MuteData['MuteName'], pos);
        pos += this.MuteData['MuteName'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjMuteData = {
            MuteID: UUID_1.UUID.zero(),
            MuteName: ''
        };
        newObjMuteData['MuteID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMuteData['MuteName'] = buf.toString('utf8', pos, length);
        pos += length;
        this.MuteData = newObjMuteData;
        return pos - startPos;
    }
}
exports.RemoveMuteListEntryPacket = RemoveMuteListEntryPacket;
//# sourceMappingURL=RemoveMuteListEntry.js.map