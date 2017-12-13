"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AgentAlertMessagePacket {
    constructor() {
        this.name = 'AgentAlertMessage';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901895;
    }
    getSize() {
        return (this.AlertData['Message'].length + 1) + 17;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.AlertData['Modal']) ? 1 : 0, pos++);
        buf.write(this.AlertData['Message'], pos);
        pos += this.AlertData['Message'].length;
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
        const newObjAlertData = {
            Modal: false,
            Message: ''
        };
        newObjAlertData['Modal'] = (buf.readUInt8(pos++) === 1);
        newObjAlertData['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        this.AlertData = newObjAlertData;
        return pos - startPos;
    }
}
exports.AgentAlertMessagePacket = AgentAlertMessagePacket;
//# sourceMappingURL=AgentAlertMessage.js.map