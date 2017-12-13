"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class MuteListUpdateMessage {
    constructor() {
        this.name = 'MuteListUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.MuteListUpdate;
    }
    getSize() {
        return (this.MuteData['Filename'].length + 1) + 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.MuteData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.MuteData['Filename'].length, pos++);
        this.MuteData['Filename'].copy(buf, pos);
        pos += this.MuteData['Filename'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjMuteData = {
            AgentID: UUID_1.UUID.zero(),
            Filename: Buffer.allocUnsafe(0)
        };
        newObjMuteData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjMuteData['Filename'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.MuteData = newObjMuteData;
        return pos - startPos;
    }
}
exports.MuteListUpdateMessage = MuteListUpdateMessage;
//# sourceMappingURL=MuteListUpdate.js.map