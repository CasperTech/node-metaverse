"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ChildAgentAlivePacket {
    constructor() {
        this.name = 'ChildAgentAlive';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 26;
    }
    getSize() {
        return 44;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.AgentData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.AgentData['RegionHandle'].high, pos);
        pos += 4;
        buf.writeUInt32LE(this.AgentData['ViewerCircuitCode'], pos);
        pos += 4;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            RegionHandle: Long.ZERO,
            ViewerCircuitCode: 0,
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjAgentData['ViewerCircuitCode'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        return pos - startPos;
    }
}
exports.ChildAgentAlivePacket = ChildAgentAlivePacket;
//# sourceMappingURL=ChildAgentAlive.js.map