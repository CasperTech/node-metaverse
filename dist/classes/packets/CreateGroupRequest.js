"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class CreateGroupRequestPacket {
    constructor() {
        this.name = 'CreateGroupRequest';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902099;
    }
    getSize() {
        return (this.GroupData['Name'].length + 1 + this.GroupData['Charter'].length + 2) + 56;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.GroupData['Name'], pos);
        pos += this.GroupData['Name'].length;
        buf.write(this.GroupData['Charter'], pos);
        pos += this.GroupData['Charter'].length;
        buf.writeUInt8((this.GroupData['ShowInList']) ? 1 : 0, pos++);
        this.GroupData['InsigniaID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.GroupData['MembershipFee'], pos);
        pos += 4;
        buf.writeUInt8((this.GroupData['OpenEnrollment']) ? 1 : 0, pos++);
        buf.writeUInt8((this.GroupData['AllowPublish']) ? 1 : 0, pos++);
        buf.writeUInt8((this.GroupData['MaturePublish']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
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
            Name: '',
            Charter: '',
            ShowInList: false,
            InsigniaID: UUID_1.UUID.zero(),
            MembershipFee: 0,
            OpenEnrollment: false,
            AllowPublish: false,
            MaturePublish: false
        };
        newObjGroupData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjGroupData['Charter'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjGroupData['ShowInList'] = (buf.readUInt8(pos++) === 1);
        newObjGroupData['InsigniaID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjGroupData['MembershipFee'] = buf.readInt32LE(pos);
        pos += 4;
        newObjGroupData['OpenEnrollment'] = (buf.readUInt8(pos++) === 1);
        newObjGroupData['AllowPublish'] = (buf.readUInt8(pos++) === 1);
        newObjGroupData['MaturePublish'] = (buf.readUInt8(pos++) === 1);
        this.GroupData = newObjGroupData;
        return pos - startPos;
    }
}
exports.CreateGroupRequestPacket = CreateGroupRequestPacket;
//# sourceMappingURL=CreateGroupRequest.js.map