"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupMembersReplyMessage {
    constructor() {
        this.name = 'GroupMembersReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupMembersReply;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.MemberData, 'OnlineStatus', 1) + this.calculateVarVarSize(this.MemberData, 'Title', 1) + 29) * this.MemberData.length) + 53;
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
        buf.writeInt32LE(this.GroupData['MemberCount'], pos);
        pos += 4;
        const count = this.MemberData.length;
        buf.writeUInt8(this.MemberData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.MemberData[i]['AgentID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.MemberData[i]['Contribution'], pos);
            pos += 4;
            buf.writeUInt8(this.MemberData[i]['OnlineStatus'].length, pos++);
            this.MemberData[i]['OnlineStatus'].copy(buf, pos);
            pos += this.MemberData[i]['OnlineStatus'].length;
            buf.writeInt32LE(this.MemberData[i]['AgentPowers'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.MemberData[i]['AgentPowers'].high, pos);
            pos += 4;
            buf.writeUInt8(this.MemberData[i]['Title'].length, pos++);
            this.MemberData[i]['Title'].copy(buf, pos);
            pos += this.MemberData[i]['Title'].length;
            buf.writeUInt8((this.MemberData[i]['IsOwner']) ? 1 : 0, pos++);
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
            MemberCount: 0
        };
        newObjGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjGroupData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjGroupData['MemberCount'] = buf.readInt32LE(pos);
        pos += 4;
        this.GroupData = newObjGroupData;
        const count = buf.readUInt8(pos++);
        this.MemberData = [];
        for (let i = 0; i < count; i++) {
            const newObjMemberData = {
                AgentID: UUID_1.UUID.zero(),
                Contribution: 0,
                OnlineStatus: Buffer.allocUnsafe(0),
                AgentPowers: Long.ZERO,
                Title: Buffer.allocUnsafe(0),
                IsOwner: false
            };
            newObjMemberData['AgentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjMemberData['Contribution'] = buf.readInt32LE(pos);
            pos += 4;
            varLength = buf.readUInt8(pos++);
            newObjMemberData['OnlineStatus'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjMemberData['AgentPowers'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            varLength = buf.readUInt8(pos++);
            newObjMemberData['Title'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjMemberData['IsOwner'] = (buf.readUInt8(pos++) === 1);
            this.MemberData.push(newObjMemberData);
        }
        return pos - startPos;
    }
}
exports.GroupMembersReplyMessage = GroupMembersReplyMessage;
//# sourceMappingURL=GroupMembersReply.js.map