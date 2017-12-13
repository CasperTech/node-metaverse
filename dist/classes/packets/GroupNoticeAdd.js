"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupNoticeAddPacket {
    constructor() {
        this.name = 'GroupNoticeAdd';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901821;
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
        buf.write(this.MessageBlock['FromAgentName'], pos);
        pos += this.MessageBlock['FromAgentName'].length;
        buf.write(this.MessageBlock['Message'], pos);
        pos += this.MessageBlock['Message'].length;
        buf.write(this.MessageBlock['BinaryBucket'], pos);
        pos += this.MessageBlock['BinaryBucket'].length;
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
        const newObjMessageBlock = {
            ToGroupID: UUID_1.UUID.zero(),
            ID: UUID_1.UUID.zero(),
            Dialog: 0,
            FromAgentName: '',
            Message: '',
            BinaryBucket: ''
        };
        newObjMessageBlock['ToGroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMessageBlock['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMessageBlock['Dialog'] = buf.readUInt8(pos++);
        newObjMessageBlock['FromAgentName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjMessageBlock['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjMessageBlock['BinaryBucket'] = buf.toString('utf8', pos, length);
        pos += length;
        this.MessageBlock = newObjMessageBlock;
        return pos - startPos;
    }
}
exports.GroupNoticeAddPacket = GroupNoticeAddPacket;
//# sourceMappingURL=GroupNoticeAdd.js.map