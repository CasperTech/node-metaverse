"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ScriptMailRegistrationMessage {
    constructor() {
        this.name = 'ScriptMailRegistration';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ScriptMailRegistration;
    }
    getSize() {
        return (this.DataBlock['TargetIP'].length + 1) + 22;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.DataBlock['TargetIP'].length, pos++);
        this.DataBlock['TargetIP'].copy(buf, pos);
        pos += this.DataBlock['TargetIP'].length;
        buf.writeUInt16LE(this.DataBlock['TargetPort'], pos);
        pos += 2;
        this.DataBlock['TaskID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.DataBlock['Flags'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjDataBlock = {
            TargetIP: Buffer.allocUnsafe(0),
            TargetPort: 0,
            TaskID: UUID_1.UUID.zero(),
            Flags: 0
        };
        varLength = buf.readUInt8(pos++);
        newObjDataBlock['TargetIP'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjDataBlock['TargetPort'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjDataBlock['TaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjDataBlock['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.ScriptMailRegistrationMessage = ScriptMailRegistrationMessage;
//# sourceMappingURL=ScriptMailRegistration.js.map