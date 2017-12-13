"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const Vector3_1 = require("../Vector3");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class CrossedRegionMessage {
    constructor() {
        this.name = 'CrossedRegion';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Blacklisted | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = Message_1.Message.CrossedRegion;
    }
    getSize() {
        return (this.RegionData['SeedCapability'].length + 2) + 70;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.RegionData['SimIP'].writeToBuffer(buf, pos);
        pos += 4;
        buf.writeUInt16LE(this.RegionData['SimPort'], pos);
        pos += 2;
        buf.writeInt32LE(this.RegionData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.RegionData['RegionHandle'].high, pos);
        pos += 4;
        buf.writeUInt16LE(this.RegionData['SeedCapability'].length, pos);
        pos += 2;
        this.RegionData['SeedCapability'].copy(buf, pos);
        pos += this.RegionData['SeedCapability'].length;
        this.Info['Position'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.Info['LookAt'].writeToBuffer(buf, pos, false);
        pos += 12;
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
        const newObjRegionData = {
            SimIP: IPAddress_1.IPAddress.zero(),
            SimPort: 0,
            RegionHandle: Long.ZERO,
            SeedCapability: Buffer.allocUnsafe(0)
        };
        newObjRegionData['SimIP'] = new IPAddress_1.IPAddress(buf, pos);
        pos += 4;
        newObjRegionData['SimPort'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjRegionData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjRegionData['SeedCapability'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.RegionData = newObjRegionData;
        const newObjInfo = {
            Position: Vector3_1.Vector3.getZero(),
            LookAt: Vector3_1.Vector3.getZero()
        };
        newObjInfo['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjInfo['LookAt'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.CrossedRegionMessage = CrossedRegionMessage;
//# sourceMappingURL=CrossedRegion.js.map