"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Quaternion_1 = require("../Quaternion");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TelehubInfoMessage {
    constructor() {
        this.name = 'TelehubInfo';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TelehubInfo;
    }
    getSize() {
        return (this.TelehubBlock['ObjectName'].length + 1) + ((12) * this.SpawnPointBlock.length) + 41;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.TelehubBlock['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.TelehubBlock['ObjectName'].length, pos++);
        this.TelehubBlock['ObjectName'].copy(buf, pos);
        pos += this.TelehubBlock['ObjectName'].length;
        this.TelehubBlock['TelehubPos'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.TelehubBlock['TelehubRot'].writeToBuffer(buf, pos);
        pos += 12;
        const count = this.SpawnPointBlock.length;
        buf.writeUInt8(this.SpawnPointBlock.length, pos++);
        for (let i = 0; i < count; i++) {
            this.SpawnPointBlock[i]['SpawnPointPos'].writeToBuffer(buf, pos, false);
            pos += 12;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjTelehubBlock = {
            ObjectID: UUID_1.UUID.zero(),
            ObjectName: Buffer.allocUnsafe(0),
            TelehubPos: Vector3_1.Vector3.getZero(),
            TelehubRot: Quaternion_1.Quaternion.getIdentity()
        };
        newObjTelehubBlock['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjTelehubBlock['ObjectName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjTelehubBlock['TelehubPos'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjTelehubBlock['TelehubRot'] = new Quaternion_1.Quaternion(buf, pos);
        pos += 12;
        this.TelehubBlock = newObjTelehubBlock;
        const count = buf.readUInt8(pos++);
        this.SpawnPointBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjSpawnPointBlock = {
                SpawnPointPos: Vector3_1.Vector3.getZero()
            };
            newObjSpawnPointBlock['SpawnPointPos'] = new Vector3_1.Vector3(buf, pos, false);
            pos += 12;
            this.SpawnPointBlock.push(newObjSpawnPointBlock);
        }
        return pos - startPos;
    }
}
exports.TelehubInfoMessage = TelehubInfoMessage;
//# sourceMappingURL=TelehubInfo.js.map