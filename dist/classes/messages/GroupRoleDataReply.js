"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupRoleDataReplyMessage {
    constructor() {
        this.name = 'GroupRoleDataReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupRoleDataReply;
    }
    getSize() {
        return this.calculateVarVarSize(this.RoleData, 'Name', 1) + this.calculateVarVarSize(this.RoleData, 'Title', 1) + this.calculateVarVarSize(this.RoleData, 'Description', 1) + ((28) * this.RoleData.length) + 53;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.GroupData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        this.GroupData['RequestID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.GroupData['RoleCount'], pos);
        pos += 4;
        const count = this.RoleData.length;
        buf.writeUInt8(this.RoleData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.RoleData[i]['RoleID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.RoleData[i]['Name'].length, pos++);
            this.RoleData[i]['Name'].copy(buf, pos);
            pos += this.RoleData[i]['Name'].length;
            buf.writeUInt8(this.RoleData[i]['Title'].length, pos++);
            this.RoleData[i]['Title'].copy(buf, pos);
            pos += this.RoleData[i]['Title'].length;
            buf.writeUInt8(this.RoleData[i]['Description'].length, pos++);
            this.RoleData[i]['Description'].copy(buf, pos);
            pos += this.RoleData[i]['Description'].length;
            buf.writeInt32LE(this.RoleData[i]['Powers'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.RoleData[i]['Powers'].high, pos);
            pos += 4;
            buf.writeUInt32LE(this.RoleData[i]['Members'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjGroupData = {
            GroupID: UUID_1.UUID.zero(),
            RequestID: UUID_1.UUID.zero(),
            RoleCount: 0
        };
        newObjGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjGroupData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjGroupData['RoleCount'] = buf.readInt32LE(pos);
        pos += 4;
        this.GroupData = newObjGroupData;
        const count = buf.readUInt8(pos++);
        this.RoleData = [];
        for (let i = 0; i < count; i++) {
            const newObjRoleData = {
                RoleID: UUID_1.UUID.zero(),
                Name: Buffer.allocUnsafe(0),
                Title: Buffer.allocUnsafe(0),
                Description: Buffer.allocUnsafe(0),
                Powers: Long.ZERO,
                Members: 0
            };
            newObjRoleData['RoleID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjRoleData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjRoleData['Title'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjRoleData['Description'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjRoleData['Powers'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjRoleData['Members'] = buf.readUInt32LE(pos);
            pos += 4;
            this.RoleData.push(newObjRoleData);
        }
        return pos - startPos;
    }
}
exports.GroupRoleDataReplyMessage = GroupRoleDataReplyMessage;
//# sourceMappingURL=GroupRoleDataReply.js.map