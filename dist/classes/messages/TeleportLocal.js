"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TeleportLocalMessage {
    constructor() {
        this.name = 'TeleportLocal';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TeleportLocal;
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
        let varLength = 0;
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
exports.TeleportLocalMessage = TeleportLocalMessage;
//# sourceMappingURL=TeleportLocal.js.map