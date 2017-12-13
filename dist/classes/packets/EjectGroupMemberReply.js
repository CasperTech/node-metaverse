"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class EjectGroupMemberReplyPacket {
    constructor() {
        this.name = 'EjectGroupMemberReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902106;
    }
    getSize() {
        return 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.GroupData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.EjectData['Success']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjGroupData = {
            GroupID: UUID_1.UUID.zero()
        };
        newObjGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.GroupData = newObjGroupData;
        const newObjEjectData = {
            Success: false
        };
        newObjEjectData['Success'] = (buf.readUInt8(pos++) === 1);
        this.EjectData = newObjEjectData;
        return pos - startPos;
    }
}
exports.EjectGroupMemberReplyPacket = EjectGroupMemberReplyPacket;
//# sourceMappingURL=EjectGroupMemberReply.js.map