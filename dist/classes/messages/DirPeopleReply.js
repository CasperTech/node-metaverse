"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class DirPeopleReplyMessage {
    constructor() {
        this.name = 'DirPeopleReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.DirPeopleReply;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.QueryReplies, 'FirstName', 1) + this.calculateVarVarSize(this.QueryReplies, 'LastName', 1) + this.calculateVarVarSize(this.QueryReplies, 'Group', 1) + 21) * this.QueryReplies.length) + 33;
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
            this.QueryReplies[i]['AgentID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.QueryReplies[i]['FirstName'].length, pos++);
            this.QueryReplies[i]['FirstName'].copy(buf, pos);
            pos += this.QueryReplies[i]['FirstName'].length;
            buf.writeUInt8(this.QueryReplies[i]['LastName'].length, pos++);
            this.QueryReplies[i]['LastName'].copy(buf, pos);
            pos += this.QueryReplies[i]['LastName'].length;
            buf.writeUInt8(this.QueryReplies[i]['Group'].length, pos++);
            this.QueryReplies[i]['Group'].copy(buf, pos);
            pos += this.QueryReplies[i]['Group'].length;
            buf.writeUInt8((this.QueryReplies[i]['Online']) ? 1 : 0, pos++);
            buf.writeInt32LE(this.QueryReplies[i]['Reputation'], pos);
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
                AgentID: UUID_1.UUID.zero(),
                FirstName: Buffer.allocUnsafe(0),
                LastName: Buffer.allocUnsafe(0),
                Group: Buffer.allocUnsafe(0),
                Online: false,
                Reputation: 0
            };
            newObjQueryReplies['AgentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjQueryReplies['FirstName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjQueryReplies['LastName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjQueryReplies['Group'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjQueryReplies['Online'] = (buf.readUInt8(pos++) === 1);
            newObjQueryReplies['Reputation'] = buf.readInt32LE(pos);
            pos += 4;
            this.QueryReplies.push(newObjQueryReplies);
        }
        return pos - startPos;
    }
}
exports.DirPeopleReplyMessage = DirPeopleReplyMessage;
//# sourceMappingURL=DirPeopleReply.js.map