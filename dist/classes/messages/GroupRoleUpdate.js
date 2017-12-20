"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupRoleUpdateMessage {
    constructor() {
        this.name = 'GroupRoleUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupRoleUpdate;
    }
    getSize() {
        return this.calculateVarVarSize(this.RoleData, 'Name', 1) + this.calculateVarVarSize(this.RoleData, 'Description', 1) + this.calculateVarVarSize(this.RoleData, 'Title', 1) + ((25) * this.RoleData.length) + 49;
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
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.RoleData.length;
        buf.writeUInt8(this.RoleData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.RoleData[i]['RoleID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.RoleData[i]['Name'].length, pos++);
            this.RoleData[i]['Name'].copy(buf, pos);
            pos += this.RoleData[i]['Name'].length;
            buf.writeUInt8(this.RoleData[i]['Description'].length, pos++);
            this.RoleData[i]['Description'].copy(buf, pos);
            pos += this.RoleData[i]['Description'].length;
            buf.writeUInt8(this.RoleData[i]['Title'].length, pos++);
            this.RoleData[i]['Title'].copy(buf, pos);
            pos += this.RoleData[i]['Title'].length;
            buf.writeInt32LE(this.RoleData[i]['Powers'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.RoleData[i]['Powers'].high, pos);
            pos += 4;
            buf.writeUInt8(this.RoleData[i]['UpdateType'], pos++);
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
        this.RoleData = [];
        for (let i = 0; i < count; i++) {
            const newObjRoleData = {
                RoleID: UUID_1.UUID.zero(),
                Name: Buffer.allocUnsafe(0),
                Description: Buffer.allocUnsafe(0),
                Title: Buffer.allocUnsafe(0),
                Powers: Long.ZERO,
                UpdateType: 0
            };
            newObjRoleData['RoleID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjRoleData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjRoleData['Description'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjRoleData['Title'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjRoleData['Powers'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjRoleData['UpdateType'] = buf.readUInt8(pos++);
            this.RoleData.push(newObjRoleData);
        }
        return pos - startPos;
    }
}
exports.GroupRoleUpdateMessage = GroupRoleUpdateMessage;
//# sourceMappingURL=GroupRoleUpdate.js.map