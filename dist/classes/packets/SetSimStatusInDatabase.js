"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SetSimStatusInDatabasePacket {
    constructor() {
        this.name = 'SetSimStatusInDatabase';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901782;
    }
    getSize() {
        return (this.Data['HostName'].length + 1 + this.Data['Status'].length + 1) + 36;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Data['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.Data['HostName'], pos);
        pos += this.Data['HostName'].length;
        buf.writeInt32LE(this.Data['X'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['Y'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['PID'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['AgentCount'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['TimeToLive'], pos);
        pos += 4;
        buf.write(this.Data['Status'], pos);
        pos += this.Data['Status'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjData = {
            RegionID: UUID_1.UUID.zero(),
            HostName: '',
            X: 0,
            Y: 0,
            PID: 0,
            AgentCount: 0,
            TimeToLive: 0,
            Status: ''
        };
        newObjData['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['HostName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['X'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['Y'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['PID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['AgentCount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['TimeToLive'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['Status'] = buf.toString('utf8', pos, length);
        pos += length;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.SetSimStatusInDatabasePacket = SetSimStatusInDatabasePacket;
//# sourceMappingURL=SetSimStatusInDatabase.js.map