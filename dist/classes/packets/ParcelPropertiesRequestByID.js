"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ParcelPropertiesRequestByIDPacket {
    constructor() {
        this.name = 'ParcelPropertiesRequestByID';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901957;
    }
    getSize() {
        return 40;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.ParcelData['SequenceID'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['LocalID'], pos);
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
            SequenceID: 0,
            LocalID: 0
        };
        newObjParcelData['SequenceID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['LocalID'] = buf.readInt32LE(pos);
        pos += 4;
        this.ParcelData = newObjParcelData;
        return pos - startPos;
    }
}
exports.ParcelPropertiesRequestByIDPacket = ParcelPropertiesRequestByIDPacket;
//# sourceMappingURL=ParcelPropertiesRequestByID.js.map