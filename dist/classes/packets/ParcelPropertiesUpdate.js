"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ParcelPropertiesUpdatePacket {
    constructor() {
        this.name = 'ParcelPropertiesUpdate';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901958;
    }
    getSize() {
        return (this.ParcelData['Name'].length + 1 + this.ParcelData['Desc'].length + 1 + this.ParcelData['MusicURL'].length + 1 + this.ParcelData['MediaURL'].length + 1) + 147;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.ParcelData['LocalID'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ParcelData['Flags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ParcelData['ParcelFlags'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['SalePrice'], pos);
        pos += 4;
        buf.write(this.ParcelData['Name'], pos);
        pos += this.ParcelData['Name'].length;
        buf.write(this.ParcelData['Desc'], pos);
        pos += this.ParcelData['Desc'].length;
        buf.write(this.ParcelData['MusicURL'], pos);
        pos += this.ParcelData['MusicURL'].length;
        buf.write(this.ParcelData['MediaURL'], pos);
        pos += this.ParcelData['MediaURL'].length;
        this.ParcelData['MediaID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ParcelData['MediaAutoScale'], pos++);
        this.ParcelData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.ParcelData['PassPrice'], pos);
        pos += 4;
        buf.writeFloatLE(this.ParcelData['PassHours'], pos);
        pos += 4;
        buf.writeUInt8(this.ParcelData['Category'], pos++);
        this.ParcelData['AuthBuyerID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ParcelData['SnapshotID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ParcelData['UserLocation'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ParcelData['UserLookAt'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt8(this.ParcelData['LandingType'], pos++);
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
        const newObjParcelData = {
            LocalID: 0,
            Flags: 0,
            ParcelFlags: 0,
            SalePrice: 0,
            Name: '',
            Desc: '',
            MusicURL: '',
            MediaURL: '',
            MediaID: UUID_1.UUID.zero(),
            MediaAutoScale: 0,
            GroupID: UUID_1.UUID.zero(),
            PassPrice: 0,
            PassHours: 0,
            Category: 0,
            AuthBuyerID: UUID_1.UUID.zero(),
            SnapshotID: UUID_1.UUID.zero(),
            UserLocation: Vector3_1.Vector3.getZero(),
            UserLookAt: Vector3_1.Vector3.getZero(),
            LandingType: 0
        };
        newObjParcelData['LocalID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjParcelData['ParcelFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjParcelData['SalePrice'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjParcelData['Desc'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjParcelData['MusicURL'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjParcelData['MediaURL'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjParcelData['MediaID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['MediaAutoScale'] = buf.readUInt8(pos++);
        newObjParcelData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['PassPrice'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['PassHours'] = buf.readFloatLE(pos);
        pos += 4;
        newObjParcelData['Category'] = buf.readUInt8(pos++);
        newObjParcelData['AuthBuyerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['SnapshotID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['UserLocation'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjParcelData['UserLookAt'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjParcelData['LandingType'] = buf.readUInt8(pos++);
        this.ParcelData = newObjParcelData;
        return pos - startPos;
    }
}
exports.ParcelPropertiesUpdatePacket = ParcelPropertiesUpdatePacket;
//# sourceMappingURL=ParcelPropertiesUpdate.js.map