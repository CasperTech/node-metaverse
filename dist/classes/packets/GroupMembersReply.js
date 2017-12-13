"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupMembersReplyPacket {
    constructor() {
        this.name = 'GroupMembersReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902127;
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
            buf.write(this.MemberData[i]['OnlineStatus'], pos);
            pos += this.MemberData[i]['OnlineStatus'].length;
            buf.writeInt32LE(this.MemberData[i]['AgentPowers'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.MemberData[i]['AgentPowers'].high, pos);
            pos += 4;
            buf.write(this.MemberData[i]['Title'], pos);
            pos += this.MemberData[i]['Title'].length;
            buf.writeUInt8((this.MemberData[i]['IsOwner']) ? 1 : 0, pos++);
        }
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
                OnlineStatus: '',
                AgentPowers: Long.ZERO,
                Title: '',
                IsOwner: false
            };
            newObjMemberData['AgentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjMemberData['Contribution'] = buf.readInt32LE(pos);
            pos += 4;
            newObjMemberData['OnlineStatus'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjMemberData['AgentPowers'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjMemberData['Title'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjMemberData['IsOwner'] = (buf.readUInt8(pos++) === 1);
            this.MemberData.push(newObjMemberData);
        }
        return pos - startPos;
    }
}
exports.GroupMembersReplyPacket = GroupMembersReplyPacket;
//# sourceMappingURL=GroupMembersReply.js.map