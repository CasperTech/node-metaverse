"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ScriptTeleportRequestPacket {
    constructor() {
        this.name = 'ScriptTeleportRequest';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901955;
    }
    getSize() {
        return (this.Data['ObjectName'].length + 1 + this.Data['SimName'].length + 1) + 24;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.write(this.Data['ObjectName'], pos);
        pos += this.Data['ObjectName'].length;
        buf.write(this.Data['SimName'], pos);
        pos += this.Data['SimName'].length;
        this.Data['SimPosition'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.Data['LookAt'].writeToBuffer(buf, pos, false);
        pos += 12;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjData = {
            ObjectName: '',
            SimName: '',
            SimPosition: Vector3_1.Vector3.getZero(),
            LookAt: Vector3_1.Vector3.getZero()
        };
        newObjData['ObjectName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['SimName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['SimPosition'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjData['LookAt'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.ScriptTeleportRequestPacket = ScriptTeleportRequestPacket;
//# sourceMappingURL=ScriptTeleportRequest.js.map