"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RevokePermissionsPacket {
    constructor() {
        this.name = 'RevokePermissions';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901953;
    }
    getSize() {
        return 52;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Data['ObjectPermissions'], pos);
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
        const newObjData = {
            ObjectID: UUID_1.UUID.zero(),
            ObjectPermissions: 0
        };
        newObjData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['ObjectPermissions'] = buf.readUInt32LE(pos);
        pos += 4;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.RevokePermissionsPacket = RevokePermissionsPacket;
//# sourceMappingURL=RevokePermissions.js.map