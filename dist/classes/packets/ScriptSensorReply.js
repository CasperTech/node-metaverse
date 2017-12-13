"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Quaternion_1 = require("../Quaternion");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ScriptSensorReplyPacket {
    constructor() {
        this.name = 'ScriptSensorReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902008;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.SensedData, 'Name', 1) + 92) * this.SensedData.length) + 17;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Requester['SourceID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.SensedData.length;
        buf.writeUInt8(this.SensedData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.SensedData[i]['ObjectID'].writeToBuffer(buf, pos);
            pos += 16;
            this.SensedData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            this.SensedData[i]['GroupID'].writeToBuffer(buf, pos);
            pos += 16;
            this.SensedData[i]['Position'].writeToBuffer(buf, pos, false);
            pos += 12;
            this.SensedData[i]['Velocity'].writeToBuffer(buf, pos, false);
            pos += 12;
            this.SensedData[i]['Rotation'].writeToBuffer(buf, pos);
            pos += 12;
            buf.write(this.SensedData[i]['Name'], pos);
            pos += this.SensedData[i]['Name'].length;
            buf.writeInt32LE(this.SensedData[i]['Type'], pos);
            pos += 4;
            buf.writeFloatLE(this.SensedData[i]['Range'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjRequester = {
            SourceID: UUID_1.UUID.zero()
        };
        newObjRequester['SourceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Requester = newObjRequester;
        const count = buf.readUInt8(pos++);
        this.SensedData = [];
        for (let i = 0; i < count; i++) {
            const newObjSensedData = {
                ObjectID: UUID_1.UUID.zero(),
                OwnerID: UUID_1.UUID.zero(),
                GroupID: UUID_1.UUID.zero(),
                Position: Vector3_1.Vector3.getZero(),
                Velocity: Vector3_1.Vector3.getZero(),
                Rotation: Quaternion_1.Quaternion.getIdentity(),
                Name: '',
                Type: 0,
                Range: 0
            };
            newObjSensedData['ObjectID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjSensedData['OwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjSensedData['GroupID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjSensedData['Position'] = new Vector3_1.Vector3(buf, pos, false);
            pos += 12;
            newObjSensedData['Velocity'] = new Vector3_1.Vector3(buf, pos, false);
            pos += 12;
            newObjSensedData['Rotation'] = new Quaternion_1.Quaternion(buf, pos);
            pos += 12;
            newObjSensedData['Name'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjSensedData['Type'] = buf.readInt32LE(pos);
            pos += 4;
            newObjSensedData['Range'] = buf.readFloatLE(pos);
            pos += 4;
            this.SensedData.push(newObjSensedData);
        }
        return pos - startPos;
    }
}
exports.ScriptSensorReplyPacket = ScriptSensorReplyPacket;
//# sourceMappingURL=ScriptSensorReply.js.map