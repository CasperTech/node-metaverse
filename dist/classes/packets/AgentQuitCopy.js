"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AgentQuitCopyPacket {
    constructor() {
        this.name = 'AgentQuitCopy';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901845;
    }
    getSize() {
        return 36;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.FuseBlock['ViewerCircuitCode'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjFuseBlock = {
            ViewerCircuitCode: 0
        };
        newObjFuseBlock['ViewerCircuitCode'] = buf.readUInt32LE(pos);
        pos += 4;
        this.FuseBlock = newObjFuseBlock;
        return pos - startPos;
    }
}
exports.AgentQuitCopyPacket = AgentQuitCopyPacket;
//# sourceMappingURL=AgentQuitCopy.js.map