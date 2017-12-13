"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SimStatusMessage {
    constructor() {
        this.name = 'SimStatus';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = Message_1.Message.SimStatus;
    }
    getSize() {
        return 10;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8((this.SimStatus['CanAcceptAgents']) ? 1 : 0, pos++);
        buf.writeUInt8((this.SimStatus['CanAcceptTasks']) ? 1 : 0, pos++);
        buf.writeInt32LE(this.SimFlags['Flags'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.SimFlags['Flags'].high, pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjSimStatus = {
            CanAcceptAgents: false,
            CanAcceptTasks: false
        };
        newObjSimStatus['CanAcceptAgents'] = (buf.readUInt8(pos++) === 1);
        newObjSimStatus['CanAcceptTasks'] = (buf.readUInt8(pos++) === 1);
        this.SimStatus = newObjSimStatus;
        const newObjSimFlags = {
            Flags: Long.ZERO
        };
        newObjSimFlags['Flags'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        this.SimFlags = newObjSimFlags;
        return pos - startPos;
    }
}
exports.SimStatusMessage = SimStatusMessage;
//# sourceMappingURL=SimStatus.js.map