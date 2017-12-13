"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupNoticesListReplyPacket {
    constructor() {
        this.name = 'GroupNoticesListReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901819;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.Data, 'FromName', 2) + this.calculateVarVarSize(this.Data, 'Subject', 2) + 22) * this.Data.length) + 33;
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
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.Data.length;
        buf.writeUInt8(this.Data.length, pos++);
        for (let i = 0; i < count; i++) {
            this.Data[i]['NoticeID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt32LE(this.Data[i]['Timestamp'], pos);
            pos += 4;
            buf.write(this.Data[i]['FromName'], pos);
            pos += this.Data[i]['FromName'].length;
            buf.write(this.Data[i]['Subject'], pos);
            pos += this.Data[i]['Subject'].length;
            buf.writeUInt8((this.Data[i]['HasAttachment']) ? 1 : 0, pos++);
            buf.writeUInt8(this.Data[i]['AssetType'], pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.Data = [];
        for (let i = 0; i < count; i++) {
            const newObjData = {
                NoticeID: UUID_1.UUID.zero(),
                Timestamp: 0,
                FromName: '',
                Subject: '',
                HasAttachment: false,
                AssetType: 0
            };
            newObjData['NoticeID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjData['Timestamp'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjData['FromName'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjData['Subject'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjData['HasAttachment'] = (buf.readUInt8(pos++) === 1);
            newObjData['AssetType'] = buf.readUInt8(pos++);
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.GroupNoticesListReplyPacket = GroupNoticesListReplyPacket;
//# sourceMappingURL=GroupNoticesListReply.js.map