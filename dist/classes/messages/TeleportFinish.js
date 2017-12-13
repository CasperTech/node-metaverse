"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TeleportFinishMessage {
    constructor() {
        this.name = 'TeleportFinish';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Blacklisted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TeleportFinish;
    }
    getSize() {
        return (this.Info['SeedCapability'].length + 2) + 39;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Info['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Info['LocationID'], pos);
        pos += 4;
        this.Info['SimIP'].writeToBuffer(buf, pos);
        pos += 4;
        buf.writeUInt16LE(this.Info['SimPort'], pos);
        pos += 2;
        buf.writeInt32LE(this.Info['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.Info['RegionHandle'].high, pos);
        pos += 4;
        buf.writeUInt16LE(this.Info['SeedCapability'].length, pos);
        pos += 2;
        this.Info['SeedCapability'].copy(buf, pos);
        pos += this.Info['SeedCapability'].length;
        buf.writeUInt8(this.Info['SimAccess'], pos++);
        buf.writeUInt32LE(this.Info['TeleportFlags'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjInfo = {
            AgentID: UUID_1.UUID.zero(),
            LocationID: 0,
            SimIP: IPAddress_1.IPAddress.zero(),
            SimPort: 0,
            RegionHandle: Long.ZERO,
            SeedCapability: Buffer.allocUnsafe(0),
            SimAccess: 0,
            TeleportFlags: 0
        };
        newObjInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['LocationID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInfo['SimIP'] = new IPAddress_1.IPAddress(buf, pos);
        pos += 4;
        newObjInfo['SimPort'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjInfo['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjInfo['SeedCapability'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjInfo['SimAccess'] = buf.readUInt8(pos++);
        newObjInfo['TeleportFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.TeleportFinishMessage = TeleportFinishMessage;
//# sourceMappingURL=TeleportFinish.js.map