"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AvatarGroupsReplyMessage {
    constructor() {
        this.name = 'AvatarGroupsReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AvatarGroupsReply;
    }
    getSize() {
        return this.calculateVarVarSize(this.GroupData, 'GroupTitle', 1) + this.calculateVarVarSize(this.GroupData, 'GroupName', 1) + ((41) * this.GroupData.length) + 34;
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
        this.AgentData['AvatarID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.GroupData.length;
        buf.writeUInt8(this.GroupData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeInt32LE(this.GroupData[i]['GroupPowers'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.GroupData[i]['GroupPowers'].high, pos);
            pos += 4;
            buf.writeUInt8((this.GroupData[i]['AcceptNotices']) ? 1 : 0, pos++);
            buf.writeUInt8(this.GroupData[i]['GroupTitle'].length, pos++);
            this.GroupData[i]['GroupTitle'].copy(buf, pos);
            pos += this.GroupData[i]['GroupTitle'].length;
            this.GroupData[i]['GroupID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.GroupData[i]['GroupName'].length, pos++);
            this.GroupData[i]['GroupName'].copy(buf, pos);
            pos += this.GroupData[i]['GroupName'].length;
            this.GroupData[i]['GroupInsigniaID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        buf.writeUInt8((this.NewGroupData['ListInProfile']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            AvatarID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['AvatarID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.GroupData = [];
        for (let i = 0; i < count; i++) {
            const newObjGroupData = {
                GroupPowers: Long.ZERO,
                AcceptNotices: false,
                GroupTitle: Buffer.allocUnsafe(0),
                GroupID: UUID_1.UUID.zero(),
                GroupName: Buffer.allocUnsafe(0),
                GroupInsigniaID: UUID_1.UUID.zero()
            };
            newObjGroupData['GroupPowers'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjGroupData['AcceptNotices'] = (buf.readUInt8(pos++) === 1);
            varLength = buf.readUInt8(pos++);
            newObjGroupData['GroupTitle'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjGroupData['GroupName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjGroupData['GroupInsigniaID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.GroupData.push(newObjGroupData);
        }
        const newObjNewGroupData = {
            ListInProfile: false
        };
        newObjNewGroupData['ListInProfile'] = (buf.readUInt8(pos++) === 1);
        this.NewGroupData = newObjNewGroupData;
        return pos - startPos;
    }
}
exports.AvatarGroupsReplyMessage = AvatarGroupsReplyMessage;
//# sourceMappingURL=AvatarGroupsReply.js.map