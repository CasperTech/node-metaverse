"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ParcelJoinPacket {
    constructor() {
        this.name = 'ParcelJoin';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901970;
    }
    getSize() {
        return 48;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeFloatLE(this.ParcelData['West'], pos);
        pos += 4;
        buf.writeFloatLE(this.ParcelData['South'], pos);
        pos += 4;
        buf.writeFloatLE(this.ParcelData['East'], pos);
        pos += 4;
        buf.writeFloatLE(this.ParcelData['North'], pos);
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
        const newObjParcelData = {
            West: 0,
            South: 0,
            East: 0,
            North: 0
        };
        newObjParcelData['West'] = buf.readFloatLE(pos);
        pos += 4;
        newObjParcelData['South'] = buf.readFloatLE(pos);
        pos += 4;
        newObjParcelData['East'] = buf.readFloatLE(pos);
        pos += 4;
        newObjParcelData['North'] = buf.readFloatLE(pos);
        pos += 4;
        this.ParcelData = newObjParcelData;
        return pos - startPos;
    }
}
exports.ParcelJoinPacket = ParcelJoinPacket;
//# sourceMappingURL=ParcelJoin.js.map