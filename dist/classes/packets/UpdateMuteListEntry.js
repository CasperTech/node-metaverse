"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class UpdateMuteListEntryPacket {
    constructor() {
        this.name = 'UpdateMuteListEntry';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902023;
    }
    getSize() {
        return (this.MuteData['MuteName'].length + 1) + 56;
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
        buf.writeInt32LE(this.MuteData['MuteType'], pos);
        pos += 4;
        buf.writeUInt32LE(this.MuteData['MuteFlags'], pos);
        pos += 4;
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
            MuteName: '',
            MuteType: 0,
            MuteFlags: 0
        };
        newObjMuteData['MuteID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMuteData['MuteName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjMuteData['MuteType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMuteData['MuteFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.MuteData = newObjMuteData;
        return pos - startPos;
    }
}
exports.UpdateMuteListEntryPacket = UpdateMuteListEntryPacket;
//# sourceMappingURL=UpdateMuteListEntry.js.map