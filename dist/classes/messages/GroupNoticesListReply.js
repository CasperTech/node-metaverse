"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupNoticesListReplyMessage {
    constructor() {
        this.name = 'GroupNoticesListReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupNoticesListReply;
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
            buf.writeUInt16LE(this.Data[i]['FromName'].length, pos);
            pos += 2;
            this.Data[i]['FromName'].copy(buf, pos);
            pos += this.Data[i]['FromName'].length;
            buf.writeUInt16LE(this.Data[i]['Subject'].length, pos);
            pos += 2;
            this.Data[i]['Subject'].copy(buf, pos);
            pos += this.Data[i]['Subject'].length;
            buf.writeUInt8((this.Data[i]['HasAttachment']) ? 1 : 0, pos++);
            buf.writeUInt8(this.Data[i]['AssetType'], pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
                FromName: Buffer.allocUnsafe(0),
                Subject: Buffer.allocUnsafe(0),
                HasAttachment: false,
                AssetType: 0
            };
            newObjData['NoticeID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjData['Timestamp'] = buf.readUInt32LE(pos);
            pos += 4;
            varLength = buf.readUInt16LE(pos);
            pos += 2;
            newObjData['FromName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt16LE(pos);
            pos += 2;
            newObjData['Subject'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjData['HasAttachment'] = (buf.readUInt8(pos++) === 1);
            newObjData['AssetType'] = buf.readUInt8(pos++);
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.GroupNoticesListReplyMessage = GroupNoticesListReplyMessage;
//# sourceMappingURL=GroupNoticesListReply.js.map