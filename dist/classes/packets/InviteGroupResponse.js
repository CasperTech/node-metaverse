"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class InviteGroupResponsePacket {
    constructor() {
        this.name = 'InviteGroupResponse';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902110;
    }
    getSize() {
        return 72;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.InviteData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InviteData['InviteeID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InviteData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InviteData['RoleID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.InviteData['MembershipFee'], pos);
        pos += 4;
        buf.writeInt32LE(this.GroupData['GroupLimit'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjInviteData = {
            AgentID: UUID_1.UUID.zero(),
            InviteeID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero(),
            RoleID: UUID_1.UUID.zero(),
            MembershipFee: 0
        };
        newObjInviteData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInviteData['InviteeID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInviteData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInviteData['RoleID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInviteData['MembershipFee'] = buf.readInt32LE(pos);
        pos += 4;
        this.InviteData = newObjInviteData;
        const newObjGroupData = {
            GroupLimit: 0
        };
        newObjGroupData['GroupLimit'] = buf.readInt32LE(pos);
        pos += 4;
        this.GroupData = newObjGroupData;
        return pos - startPos;
    }
}
exports.InviteGroupResponsePacket = InviteGroupResponsePacket;
//# sourceMappingURL=InviteGroupResponse.js.map