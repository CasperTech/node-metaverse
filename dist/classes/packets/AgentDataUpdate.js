"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AgentDataUpdatePacket {
    constructor() {
        this.name = 'AgentDataUpdate';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902147;
    }
    getSize() {
        return (this.AgentData['FirstName'].length + 1 + this.AgentData['LastName'].length + 1 + this.AgentData['GroupTitle'].length + 1 + this.AgentData['GroupName'].length + 1) + 40;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.AgentData['FirstName'], pos);
        pos += this.AgentData['FirstName'].length;
        buf.write(this.AgentData['LastName'], pos);
        pos += this.AgentData['LastName'].length;
        buf.write(this.AgentData['GroupTitle'], pos);
        pos += this.AgentData['GroupTitle'].length;
        this.AgentData['ActiveGroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.AgentData['GroupPowers'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.AgentData['GroupPowers'].high, pos);
        pos += 4;
        buf.write(this.AgentData['GroupName'], pos);
        pos += this.AgentData['GroupName'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            FirstName: '',
            LastName: '',
            GroupTitle: '',
            ActiveGroupID: UUID_1.UUID.zero(),
            GroupPowers: Long.ZERO,
            GroupName: ''
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['FirstName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjAgentData['LastName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjAgentData['GroupTitle'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjAgentData['ActiveGroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupPowers'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjAgentData['GroupName'] = buf.toString('utf8', pos, length);
        pos += length;
        this.AgentData = newObjAgentData;
        return pos - startPos;
    }
}
exports.AgentDataUpdatePacket = AgentDataUpdatePacket;
//# sourceMappingURL=AgentDataUpdate.js.map