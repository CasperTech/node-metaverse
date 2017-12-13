"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class UpdateGroupInfoMessage {
    constructor() {
        this.name = 'UpdateGroupInfo';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.UpdateGroupInfo;
    }
    getSize() {
        return (this.GroupData['Charter'].length + 2) + 72;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.GroupData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt16LE(this.GroupData['Charter'].length, pos);
        pos += 2;
        this.GroupData['Charter'].copy(buf, pos);
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
            GroupID: UUID_1.UUID.zero(),
            Charter: Buffer.allocUnsafe(0),
            ShowInList: false,
            InsigniaID: UUID_1.UUID.zero(),
            MembershipFee: 0,
            OpenEnrollment: false,
            AllowPublish: false,
            MaturePublish: false
        };
        newObjGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjGroupData['Charter'] = buf.slice(pos, pos + varLength);
        pos += varLength;
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
exports.UpdateGroupInfoMessage = UpdateGroupInfoMessage;
//# sourceMappingURL=UpdateGroupInfo.js.map