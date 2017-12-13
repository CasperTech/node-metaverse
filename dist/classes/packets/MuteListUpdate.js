"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MuteListUpdatePacket {
    constructor() {
        this.name = 'MuteListUpdate';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902078;
    }
    getSize() {
        return (this.MuteData['Filename'].length + 1) + 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.MuteData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.MuteData['Filename'], pos);
        pos += this.MuteData['Filename'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjMuteData = {
            AgentID: UUID_1.UUID.zero(),
            Filename: ''
        };
        newObjMuteData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMuteData['Filename'] = buf.toString('utf8', pos, length);
        pos += length;
        this.MuteData = newObjMuteData;
        return pos - startPos;
    }
}
exports.MuteListUpdatePacket = MuteListUpdatePacket;
//# sourceMappingURL=MuteListUpdate.js.map