"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupRoleMembersReplyMessage {
    constructor() {
        this.name = 'GroupRoleMembersReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupRoleMembersReply;
    }
    getSize() {
        return ((32) * this.MemberData.length) + 53;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['RequestID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['TotalPairs'], pos);
        pos += 4;
        const count = this.MemberData.length;
        buf.writeUInt8(this.MemberData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.MemberData[i]['RoleID'].writeToBuffer(buf, pos);
            pos += 16;
            this.MemberData[i]['MemberID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero(),
            RequestID: UUID_1.UUID.zero(),
            TotalPairs: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['TotalPairs'] = buf.readUInt32LE(pos);
        pos += 4;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.MemberData = [];
        for (let i = 0; i < count; i++) {
            const newObjMemberData = {
                RoleID: UUID_1.UUID.zero(),
                MemberID: UUID_1.UUID.zero()
            };
            newObjMemberData['RoleID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjMemberData['MemberID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.MemberData.push(newObjMemberData);
        }
        return pos - startPos;
    }
}
exports.GroupRoleMembersReplyMessage = GroupRoleMembersReplyMessage;
//# sourceMappingURL=GroupRoleMembersReply.js.map