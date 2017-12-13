"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ScriptTeleportRequestMessage {
    constructor() {
        this.name = 'ScriptTeleportRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ScriptTeleportRequest;
    }
    getSize() {
        return (this.Data['ObjectName'].length + 1 + this.Data['SimName'].length + 1) + 24;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.Data['ObjectName'].length, pos++);
        this.Data['ObjectName'].copy(buf, pos);
        pos += this.Data['ObjectName'].length;
        buf.writeUInt8(this.Data['SimName'].length, pos++);
        this.Data['SimName'].copy(buf, pos);
        pos += this.Data['SimName'].length;
        this.Data['SimPosition'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.Data['LookAt'].writeToBuffer(buf, pos, false);
        pos += 12;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjData = {
            ObjectName: Buffer.allocUnsafe(0),
            SimName: Buffer.allocUnsafe(0),
            SimPosition: Vector3_1.Vector3.getZero(),
            LookAt: Vector3_1.Vector3.getZero()
        };
        varLength = buf.readUInt8(pos++);
        newObjData['ObjectName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjData['SimName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjData['SimPosition'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjData['LookAt'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.ScriptTeleportRequestMessage = ScriptTeleportRequestMessage;
//# sourceMappingURL=ScriptTeleportRequest.js.map