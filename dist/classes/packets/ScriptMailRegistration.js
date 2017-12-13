"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ScriptMailRegistrationPacket {
    constructor() {
        this.name = 'ScriptMailRegistration';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902178;
    }
    getSize() {
        return (this.DataBlock['TargetIP'].length + 1) + 22;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.write(this.DataBlock['TargetIP'], pos);
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
        const newObjDataBlock = {
            TargetIP: '',
            TargetPort: 0,
            TaskID: UUID_1.UUID.zero(),
            Flags: 0
        };
        newObjDataBlock['TargetIP'] = buf.toString('utf8', pos, length);
        pos += length;
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
exports.ScriptMailRegistrationPacket = ScriptMailRegistrationPacket;
//# sourceMappingURL=ScriptMailRegistration.js.map