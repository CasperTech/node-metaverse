"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GroupNoticeAddMessage {
    constructor() {
        this.name = 'GroupNoticeAdd';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GroupNoticeAdd;
    }
    getSize() {
        return (this.MessageBlock['FromAgentName'].length + 1 + this.MessageBlock['Message'].length + 2 + this.MessageBlock['BinaryBucket'].length + 2) + 49;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.MessageBlock['ToGroupID'].writeToBuffer(buf, pos);
        pos += 16;
        this.MessageBlock['ID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.MessageBlock['Dialog'], pos++);
        buf.writeUInt8(this.MessageBlock['FromAgentName'].length, pos++);
        this.MessageBlock['FromAgentName'].copy(buf, pos);
        pos += this.MessageBlock['FromAgentName'].length;
        buf.writeUInt16LE(this.MessageBlock['Message'].length, pos);
        pos += 2;
        this.MessageBlock['Message'].copy(buf, pos);
        pos += this.MessageBlock['Message'].length;
        buf.writeUInt16LE(this.MessageBlock['BinaryBucket'].length, pos);
        pos += 2;
        this.MessageBlock['BinaryBucket'].copy(buf, pos);
        pos += this.MessageBlock['BinaryBucket'].length;
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
        const newObjMessageBlock = {
            ToGroupID: UUID_1.UUID.zero(),
            ID: UUID_1.UUID.zero(),
            Dialog: 0,
            FromAgentName: Buffer.allocUnsafe(0),
            Message: Buffer.allocUnsafe(0),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        newObjMessageBlock['ToGroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMessageBlock['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMessageBlock['Dialog'] = buf.readUInt8(pos++);
        varLength = buf.readUInt8(pos++);
        newObjMessageBlock['FromAgentName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjMessageBlock['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjMessageBlock['BinaryBucket'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.MessageBlock = newObjMessageBlock;
        return pos - startPos;
    }
}
exports.GroupNoticeAddMessage = GroupNoticeAddMessage;
//# sourceMappingURL=GroupNoticeAdd.js.map