"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AgentMovementCompletePacket {
    constructor() {
        this.name = 'AgentMovementComplete';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902010;
    }
    getSize() {
        return (this.SimData['ChannelVersion'].length + 2) + 68;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['Position'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.Data['LookAt'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeInt32LE(this.Data['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.Data['RegionHandle'].high, pos);
        pos += 4;
        buf.writeUInt32LE(this.Data['Timestamp'], pos);
        pos += 4;
        buf.write(this.SimData['ChannelVersion'], pos);
        pos += this.SimData['ChannelVersion'].length;
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
            Position: Vector3_1.Vector3.getZero(),
            LookAt: Vector3_1.Vector3.getZero(),
            RegionHandle: Long.ZERO,
            Timestamp: 0
        };
        newObjData['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjData['LookAt'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjData['Timestamp'] = buf.readUInt32LE(pos);
        pos += 4;
        this.Data = newObjData;
        const newObjSimData = {
            ChannelVersion: ''
        };
        newObjSimData['ChannelVersion'] = buf.toString('utf8', pos, length);
        pos += length;
        this.SimData = newObjSimData;
        return pos - startPos;
    }
}
exports.AgentMovementCompletePacket = AgentMovementCompletePacket;
//# sourceMappingURL=AgentMovementComplete.js.map