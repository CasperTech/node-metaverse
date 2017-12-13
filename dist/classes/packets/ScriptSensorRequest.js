"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Long = require("long");
const Quaternion_1 = require("../Quaternion");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ScriptSensorRequestPacket {
    constructor() {
        this.name = 'ScriptSensorRequest';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902007;
    }
    getSize() {
        return (this.Requester['SearchName'].length + 1) + 93;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Requester['SourceID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Requester['RequestID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Requester['SearchID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Requester['SearchPos'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.Requester['SearchDir'].writeToBuffer(buf, pos);
        pos += 12;
        buf.write(this.Requester['SearchName'], pos);
        pos += this.Requester['SearchName'].length;
        buf.writeInt32LE(this.Requester['Type'], pos);
        pos += 4;
        buf.writeFloatLE(this.Requester['Range'], pos);
        pos += 4;
        buf.writeFloatLE(this.Requester['Arc'], pos);
        pos += 4;
        buf.writeInt32LE(this.Requester['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.Requester['RegionHandle'].high, pos);
        pos += 4;
        buf.writeUInt8(this.Requester['SearchRegions'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjRequester = {
            SourceID: UUID_1.UUID.zero(),
            RequestID: UUID_1.UUID.zero(),
            SearchID: UUID_1.UUID.zero(),
            SearchPos: Vector3_1.Vector3.getZero(),
            SearchDir: Quaternion_1.Quaternion.getIdentity(),
            SearchName: '',
            Type: 0,
            Range: 0,
            Arc: 0,
            RegionHandle: Long.ZERO,
            SearchRegions: 0
        };
        newObjRequester['SourceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRequester['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRequester['SearchID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRequester['SearchPos'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjRequester['SearchDir'] = new Quaternion_1.Quaternion(buf, pos);
        pos += 12;
        newObjRequester['SearchName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjRequester['Type'] = buf.readInt32LE(pos);
        pos += 4;
        newObjRequester['Range'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRequester['Arc'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRequester['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjRequester['SearchRegions'] = buf.readUInt8(pos++);
        this.Requester = newObjRequester;
        return pos - startPos;
    }
}
exports.ScriptSensorRequestPacket = ScriptSensorRequestPacket;
//# sourceMappingURL=ScriptSensorRequest.js.map