"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SetSimPresenceInDatabasePacket {
    constructor() {
        this.name = 'SetSimPresenceInDatabase';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901783;
    }
    getSize() {
        return (this.SimData['HostName'].length + 1 + this.SimData['Status'].length + 1) + 36;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.SimData['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.SimData['HostName'], pos);
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
        buf.write(this.SimData['Status'], pos);
        pos += this.SimData['Status'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjSimData = {
            RegionID: UUID_1.UUID.zero(),
            HostName: '',
            GridX: 0,
            GridY: 0,
            PID: 0,
            AgentCount: 0,
            TimeToLive: 0,
            Status: ''
        };
        newObjSimData['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjSimData['HostName'] = buf.toString('utf8', pos, length);
        pos += length;
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
        newObjSimData['Status'] = buf.toString('utf8', pos, length);
        pos += length;
        this.SimData = newObjSimData;
        return pos - startPos;
    }
}
exports.SetSimPresenceInDatabasePacket = SetSimPresenceInDatabasePacket;
//# sourceMappingURL=SetSimPresenceInDatabase.js.map