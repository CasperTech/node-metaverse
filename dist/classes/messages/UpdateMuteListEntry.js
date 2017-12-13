"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class UpdateMuteListEntryMessage {
    constructor() {
        this.name = 'UpdateMuteListEntry';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.UpdateMuteListEntry;
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
        buf.writeUInt8(this.MuteData['MuteName'].length, pos++);
        this.MuteData['MuteName'].copy(buf, pos);
        pos += this.MuteData['MuteName'].length;
        buf.writeInt32LE(this.MuteData['MuteType'], pos);
        pos += 4;
        buf.writeUInt32LE(this.MuteData['MuteFlags'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
            MuteName: Buffer.allocUnsafe(0),
            MuteType: 0,
            MuteFlags: 0
        };
        newObjMuteData['MuteID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjMuteData['MuteName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjMuteData['MuteType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjMuteData['MuteFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.MuteData = newObjMuteData;
        return pos - startPos;
    }
}
exports.UpdateMuteListEntryMessage = UpdateMuteListEntryMessage;
//# sourceMappingURL=UpdateMuteListEntry.js.map