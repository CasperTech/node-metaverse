"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AgentMovementCompleteMessage {
    constructor() {
        this.name = 'AgentMovementComplete';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AgentMovementComplete;
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
        buf.writeUInt16LE(this.SimData['ChannelVersion'].length, pos);
        pos += 2;
        this.SimData['ChannelVersion'].copy(buf, pos);
        pos += this.SimData['ChannelVersion'].length;
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
            ChannelVersion: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjSimData['ChannelVersion'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.SimData = newObjSimData;
        return pos - startPos;
    }
}
exports.AgentMovementCompleteMessage = AgentMovementCompleteMessage;
//# sourceMappingURL=AgentMovementComplete.js.map