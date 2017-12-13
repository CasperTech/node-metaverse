"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AvatarPickerRequestBackendPacket {
    constructor() {
        this.name = 'AvatarPickerRequestBackend';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901787;
    }
    getSize() {
        return (this.Data['Name'].length + 1) + 49;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.AgentData['GodLevel'], pos++);
        buf.write(this.Data['Name'], pos);
        pos += this.Data['Name'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            QueryID: UUID_1.UUID.zero(),
            GodLevel: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GodLevel'] = buf.readUInt8(pos++);
        this.AgentData = newObjAgentData;
        const newObjData = {
            Name: ''
        };
        newObjData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.AvatarPickerRequestBackendPacket = AvatarPickerRequestBackendPacket;
//# sourceMappingURL=AvatarPickerRequestBackend.js.map