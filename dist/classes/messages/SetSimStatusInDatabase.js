"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SetSimStatusInDatabaseMessage {
    constructor() {
        this.name = 'SetSimStatusInDatabase';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SetSimStatusInDatabase;
    }
    getSize() {
        return (this.Data['HostName'].length + 1 + this.Data['Status'].length + 1) + 36;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Data['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.Data['HostName'].length, pos++);
        this.Data['HostName'].copy(buf, pos);
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
        buf.writeUInt8(this.Data['Status'].length, pos++);
        this.Data['Status'].copy(buf, pos);
        pos += this.Data['Status'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjData = {
            RegionID: UUID_1.UUID.zero(),
            HostName: Buffer.allocUnsafe(0),
            X: 0,
            Y: 0,
            PID: 0,
            AgentCount: 0,
            TimeToLive: 0,
            Status: Buffer.allocUnsafe(0)
        };
        newObjData['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjData['HostName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
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
        varLength = buf.readUInt8(pos++);
        newObjData['Status'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.SetSimStatusInDatabaseMessage = SetSimStatusInDatabaseMessage;
//# sourceMappingURL=SetSimStatusInDatabase.js.map