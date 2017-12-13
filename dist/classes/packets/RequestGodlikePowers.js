"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RequestGodlikePowersPacket {
    constructor() {
        this.name = 'RequestGodlikePowers';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902017;
    }
    getSize() {
        return 49;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.RequestBlock['Godlike']) ? 1 : 0, pos++);
        this.RequestBlock['Token'].writeToBuffer(buf, pos);
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
        const newObjRequestBlock = {
            Godlike: false,
            Token: UUID_1.UUID.zero()
        };
        newObjRequestBlock['Godlike'] = (buf.readUInt8(pos++) === 1);
        newObjRequestBlock['Token'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.RequestBlock = newObjRequestBlock;
        return pos - startPos;
    }
}
exports.RequestGodlikePowersPacket = RequestGodlikePowersPacket;
//# sourceMappingURL=RequestGodlikePowers.js.map