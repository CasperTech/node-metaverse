"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupProfileReplyPacket {
    constructor() {
        this.name = 'GroupProfileReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902112;
    }
    getSize() {
        return (this.GroupData['Name'].length + 1 + this.GroupData['Charter'].length + 2 + this.GroupData['MemberTitle'].length + 1) + 108;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.GroupData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.GroupData['Name'], pos);
        pos += this.GroupData['Name'].length;
        buf.write(this.GroupData['Charter'], pos);
        pos += this.GroupData['Charter'].length;
        buf.writeUInt8((this.GroupData['ShowInList']) ? 1 : 0, pos++);
        buf.write(this.GroupData['MemberTitle'], pos);
        pos += this.GroupData['MemberTitle'].length;
        buf.writeInt32LE(this.GroupData['PowersMask'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.GroupData['PowersMask'].high, pos);
        pos += 4;
        this.GroupData['InsigniaID'].writeToBuffer(buf, pos);
        pos += 16;
        this.GroupData['FounderID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.GroupData['MembershipFee'], pos);
        pos += 4;
        buf.writeUInt8((this.GroupData['OpenEnrollment']) ? 1 : 0, pos++);
        buf.writeInt32LE(this.GroupData['Money'], pos);
        pos += 4;
        buf.writeInt32LE(this.GroupData['GroupMembershipCount'], pos);
        pos += 4;
        buf.writeInt32LE(this.GroupData['GroupRolesCount'], pos);
        pos += 4;
        buf.writeUInt8((this.GroupData['AllowPublish']) ? 1 : 0, pos++);
        buf.writeUInt8((this.GroupData['MaturePublish']) ? 1 : 0, pos++);
        this.GroupData['OwnerRole'].writeToBuffer(buf, pos);
        pos += 16;
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
            Name: '',
            Charter: '',
            ShowInList: false,
            MemberTitle: '',
            PowersMask: Long.ZERO,
            InsigniaID: UUID_1.UUID.zero(),
            FounderID: UUID_1.UUID.zero(),
            MembershipFee: 0,
            OpenEnrollment: false,
            Money: 0,
            GroupMembershipCount: 0,
            GroupRolesCount: 0,
            AllowPublish: false,
            MaturePublish: false,
            OwnerRole: UUID_1.UUID.zero()
        };
        newObjGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjGroupData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjGroupData['Charter'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjGroupData['ShowInList'] = (buf.readUInt8(pos++) === 1);
        newObjGroupData['MemberTitle'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjGroupData['PowersMask'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjGroupData['InsigniaID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjGroupData['FounderID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjGroupData['MembershipFee'] = buf.readInt32LE(pos);
        pos += 4;
        newObjGroupData['OpenEnrollment'] = (buf.readUInt8(pos++) === 1);
        newObjGroupData['Money'] = buf.readInt32LE(pos);
        pos += 4;
        newObjGroupData['GroupMembershipCount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjGroupData['GroupRolesCount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjGroupData['AllowPublish'] = (buf.readUInt8(pos++) === 1);
        newObjGroupData['MaturePublish'] = (buf.readUInt8(pos++) === 1);
        newObjGroupData['OwnerRole'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.GroupData = newObjGroupData;
        return pos - startPos;
    }
}
exports.GroupProfileReplyPacket = GroupProfileReplyPacket;
//# sourceMappingURL=GroupProfileReply.js.map