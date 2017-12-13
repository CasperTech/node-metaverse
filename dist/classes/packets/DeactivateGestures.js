"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DeactivateGesturesPacket {
    constructor() {
        this.name = 'DeactivateGestures';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902077;
    }
    getSize() {
        return ((20) * this.Data.length) + 37;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['Flags'], pos);
        pos += 4;
        const count = this.Data.length;
        buf.writeUInt8(this.Data.length, pos++);
        for (let i = 0; i < count; i++) {
            this.Data[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt32LE(this.Data[i]['GestureFlags'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            Flags: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.Data = [];
        for (let i = 0; i < count; i++) {
            const newObjData = {
                ItemID: UUID_1.UUID.zero(),
                GestureFlags: 0
            };
            newObjData['ItemID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjData['GestureFlags'] = buf.readUInt32LE(pos);
            pos += 4;
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.DeactivateGesturesPacket = DeactivateGesturesPacket;
//# sourceMappingURL=DeactivateGestures.js.map