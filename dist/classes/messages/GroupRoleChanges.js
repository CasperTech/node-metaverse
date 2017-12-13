"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupRoleChangesMessage {
    constructor() {
        this.name = 'GroupRoleChanges';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupRoleChanges;
    }
    getSize() {
        return ((36) * this.RoleChange.length) + 49;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.RoleChange.length;
        buf.writeUInt8(this.RoleChange.length, pos++);
        for (let i = 0; i < count; i++) {
            this.RoleChange[i]['RoleID'].writeToBuffer(buf, pos);
            pos += 16;
            this.RoleChange[i]['MemberID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt32LE(this.RoleChange[i]['Change'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.RoleChange = [];
        for (let i = 0; i < count; i++) {
            const newObjRoleChange = {
                RoleID: UUID_1.UUID.zero(),
                MemberID: UUID_1.UUID.zero(),
                Change: 0
            };
            newObjRoleChange['RoleID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjRoleChange['MemberID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjRoleChange['Change'] = buf.readUInt32LE(pos);
            pos += 4;
            this.RoleChange.push(newObjRoleChange);
        }
        return pos - startPos;
    }
}
exports.GroupRoleChangesMessage = GroupRoleChangesMessage;
//# sourceMappingURL=GroupRoleChanges.js.map