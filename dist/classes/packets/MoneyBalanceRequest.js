"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MoneyBalanceRequestPacket {
    constructor() {
        this.name = 'MoneyBalanceRequest';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902073;
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
        this.MoneyData['TransactionID'].writeToBuffer(buf, pos);
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
        const newObjMoneyData = {
            TransactionID: UUID_1.UUID.zero()
        };
        newObjMoneyData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.MoneyData = newObjMoneyData;
        return pos - startPos;
    }
}
exports.MoneyBalanceRequestPacket = MoneyBalanceRequestPacket;
//# sourceMappingURL=MoneyBalanceRequest.js.map