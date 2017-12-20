"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupTitlesReplyMessage {
    constructor() {
        this.name = 'GroupTitlesReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupTitlesReply;
    }
    getSize() {
        return this.calculateVarVarSize(this.GroupData, 'Title', 1) + ((17) * this.GroupData.length) + 49;
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
        this.AgentData['RequestID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.GroupData.length;
        buf.writeUInt8(this.GroupData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.GroupData[i]['Title'].length, pos++);
            this.GroupData[i]['Title'].copy(buf, pos);
            pos += this.GroupData[i]['Title'].length;
            this.GroupData[i]['RoleID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8((this.GroupData[i]['Selected']) ? 1 : 0, pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero(),
            RequestID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['RequestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.GroupData = [];
        for (let i = 0; i < count; i++) {
            const newObjGroupData = {
                Title: Buffer.allocUnsafe(0),
                RoleID: UUID_1.UUID.zero(),
                Selected: false
            };
            varLength = buf.readUInt8(pos++);
            newObjGroupData['Title'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjGroupData['RoleID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjGroupData['Selected'] = (buf.readUInt8(pos++) === 1);
            this.GroupData.push(newObjGroupData);
        }
        return pos - startPos;
    }
}
exports.GroupTitlesReplyMessage = GroupTitlesReplyMessage;
//# sourceMappingURL=GroupTitlesReply.js.map