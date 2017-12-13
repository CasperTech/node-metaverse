"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class OfferCallingCardPacket {
    constructor() {
        this.name = 'OfferCallingCard';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902061;
    }
    getSize() {
        return 64;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentBlock['DestID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentBlock['TransactionID'].writeToBuffer(buf, pos);
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
        const newObjAgentBlock = {
            DestID: UUID_1.UUID.zero(),
            TransactionID: UUID_1.UUID.zero()
        };
        newObjAgentBlock['DestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentBlock['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentBlock = newObjAgentBlock;
        return pos - startPos;
    }
}
exports.OfferCallingCardPacket = OfferCallingCardPacket;
//# sourceMappingURL=OfferCallingCard.js.map