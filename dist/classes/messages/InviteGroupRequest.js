"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class InviteGroupRequestMessage {
    constructor() {
        this.name = 'InviteGroupRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.InviteGroupRequest;
    }
    getSize() {
        return ((32) * this.InviteData.length) + 49;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.GroupData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.InviteData.length;
        buf.writeUInt8(this.InviteData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.InviteData[i]['InviteeID'].writeToBuffer(buf, pos);
            pos += 16;
            this.InviteData[i]['RoleID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjGroupData = {
            GroupID: UUID_1.UUID.zero()
        };
        newObjGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.GroupData = newObjGroupData;
        const count = buf.readUInt8(pos++);
        this.InviteData = [];
        for (let i = 0; i < count; i++) {
            const newObjInviteData = {
                InviteeID: UUID_1.UUID.zero(),
                RoleID: UUID_1.UUID.zero()
            };
            newObjInviteData['InviteeID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjInviteData['RoleID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.InviteData.push(newObjInviteData);
        }
        return pos - startPos;
    }
}
exports.InviteGroupRequestMessage = InviteGroupRequestMessage;
//# sourceMappingURL=InviteGroupRequest.js.map