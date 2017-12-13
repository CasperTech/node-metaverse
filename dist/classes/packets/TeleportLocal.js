"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TeleportLocalPacket {
    constructor() {
        this.name = 'TeleportLocal';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901824;
    }
    getSize() {
        return 48;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Info['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Info['LocationID'], pos);
        pos += 4;
        this.Info['Position'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.Info['LookAt'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt32LE(this.Info['TeleportFlags'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjInfo = {
            AgentID: UUID_1.UUID.zero(),
            LocationID: 0,
            Position: Vector3_1.Vector3.getZero(),
            LookAt: Vector3_1.Vector3.getZero(),
            TeleportFlags: 0
        };
        newObjInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['LocationID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInfo['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjInfo['LookAt'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjInfo['TeleportFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.TeleportLocalPacket = TeleportLocalPacket;
//# sourceMappingURL=TeleportLocal.js.map