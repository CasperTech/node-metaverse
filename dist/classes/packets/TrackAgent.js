"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TrackAgentPacket {
    constructor() {
        this.name = 'TrackAgent';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901890;
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
        this.TargetData['PreyID'].writeToBuffer(buf, pos);
        pos += 16;
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
        const newObjTargetData = {
            PreyID: UUID_1.UUID.zero()
        };
        newObjTargetData['PreyID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.TargetData = newObjTargetData;
        return pos - startPos;
    }
}
exports.TrackAgentPacket = TrackAgentPacket;
//# sourceMappingURL=TrackAgent.js.map