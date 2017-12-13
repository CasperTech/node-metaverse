"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SetSimPresenceInDatabaseMessage {
    constructor() {
        this.name = 'SetSimPresenceInDatabase';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SetSimPresenceInDatabase;
    }
    getSize() {
        return (this.SimData['HostName'].length + 1 + this.SimData['Status'].length + 1) + 36;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.SimData['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.SimData['HostName'].length, pos++);
        this.SimData['HostName'].copy(buf, pos);
        pos += this.SimData['HostName'].length;
        buf.writeUInt32LE(this.SimData['GridX'], pos);
        pos += 4;
        buf.writeUInt32LE(this.SimData['GridY'], pos);
        pos += 4;
        buf.writeInt32LE(this.SimData['PID'], pos);
        pos += 4;
        buf.writeInt32LE(this.SimData['AgentCount'], pos);
        pos += 4;
        buf.writeInt32LE(this.SimData['TimeToLive'], pos);
        pos += 4;
        buf.writeUInt8(this.SimData['Status'].length, pos++);
        this.SimData['Status'].copy(buf, pos);
        pos += this.SimData['Status'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjSimData = {
            RegionID: UUID_1.UUID.zero(),
            HostName: Buffer.allocUnsafe(0),
            GridX: 0,
            GridY: 0,
            PID: 0,
            AgentCount: 0,
            TimeToLive: 0,
            Status: Buffer.allocUnsafe(0)
        };
        newObjSimData['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjSimData['HostName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjSimData['GridX'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjSimData['GridY'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjSimData['PID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjSimData['AgentCount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjSimData['TimeToLive'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjSimData['Status'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.SimData = newObjSimData;
        return pos - startPos;
    }
}
exports.SetSimPresenceInDatabaseMessage = SetSimPresenceInDatabaseMessage;
//# sourceMappingURL=SetSimPresenceInDatabase.js.map