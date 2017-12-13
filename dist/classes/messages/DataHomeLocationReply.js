"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class DataHomeLocationReplyMessage {
    constructor() {
        this.name = 'DataHomeLocationReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.DataHomeLocationReply;
    }
    getSize() {
        return 48;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Info['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.Info['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.Info['RegionHandle'].high, pos);
        pos += 4;
        this.Info['Position'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.Info['LookAt'].writeToBuffer(buf, pos, false);
        pos += 12;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjInfo = {
            AgentID: UUID_1.UUID.zero(),
            RegionHandle: Long.ZERO,
            Position: Vector3_1.Vector3.getZero(),
            LookAt: Vector3_1.Vector3.getZero()
        };
        newObjInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjInfo['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjInfo['LookAt'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.DataHomeLocationReplyMessage = DataHomeLocationReplyMessage;
//# sourceMappingURL=DataHomeLocationReply.js.map