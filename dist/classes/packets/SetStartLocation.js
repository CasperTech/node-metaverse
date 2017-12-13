"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SetStartLocationPacket {
    constructor() {
        this.name = 'SetStartLocation';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902085;
    }
    getSize() {
        return 68;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.StartLocationData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.StartLocationData['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.StartLocationData['LocationID'], pos);
        pos += 4;
        buf.writeInt32LE(this.StartLocationData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.StartLocationData['RegionHandle'].high, pos);
        pos += 4;
        this.StartLocationData['LocationPos'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.StartLocationData['LocationLookAt'].writeToBuffer(buf, pos, false);
        pos += 12;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjStartLocationData = {
            AgentID: UUID_1.UUID.zero(),
            RegionID: UUID_1.UUID.zero(),
            LocationID: 0,
            RegionHandle: Long.ZERO,
            LocationPos: Vector3_1.Vector3.getZero(),
            LocationLookAt: Vector3_1.Vector3.getZero()
        };
        newObjStartLocationData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjStartLocationData['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjStartLocationData['LocationID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjStartLocationData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjStartLocationData['LocationPos'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjStartLocationData['LocationLookAt'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        this.StartLocationData = newObjStartLocationData;
        return pos - startPos;
    }
}
exports.SetStartLocationPacket = SetStartLocationPacket;
//# sourceMappingURL=SetStartLocation.js.map