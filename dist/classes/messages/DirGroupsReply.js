"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class DirGroupsReplyMessage {
    constructor() {
        this.name = 'DirGroupsReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.DirGroupsReply;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.QueryReplies, 'GroupName', 1) + 24) * this.QueryReplies.length) + 33;
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
        this.QueryData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.QueryReplies.length;
        buf.writeUInt8(this.QueryReplies.length, pos++);
        for (let i = 0; i < count; i++) {
            this.QueryReplies[i]['GroupID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.QueryReplies[i]['GroupName'].length, pos++);
            this.QueryReplies[i]['GroupName'].copy(buf, pos);
            pos += this.QueryReplies[i]['GroupName'].length;
            buf.writeInt32LE(this.QueryReplies[i]['Members'], pos);
            pos += 4;
            buf.writeFloatLE(this.QueryReplies[i]['SearchOrder'], pos);
            pos += 4;
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
        const newObjQueryData = {
            QueryID: UUID_1.UUID.zero()
        };
        newObjQueryData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.QueryData = newObjQueryData;
        const count = buf.readUInt8(pos++);
        this.QueryReplies = [];
        for (let i = 0; i < count; i++) {
            const newObjQueryReplies = {
                GroupID: UUID_1.UUID.zero(),
                GroupName: Buffer.allocUnsafe(0),
                Members: 0,
                SearchOrder: 0
            };
            newObjQueryReplies['GroupID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjQueryReplies['GroupName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjQueryReplies['Members'] = buf.readInt32LE(pos);
            pos += 4;
            newObjQueryReplies['SearchOrder'] = buf.readFloatLE(pos);
            pos += 4;
            this.QueryReplies.push(newObjQueryReplies);
        }
        return pos - startPos;
    }
}
exports.DirGroupsReplyMessage = DirGroupsReplyMessage;
//# sourceMappingURL=DirGroupsReply.js.map