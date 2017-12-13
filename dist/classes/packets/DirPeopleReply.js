"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DirPeopleReplyPacket {
    constructor() {
        this.name = 'DirPeopleReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901796;
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
            buf.write(this.QueryReplies[i]['FirstName'], pos);
            pos += this.QueryReplies[i]['FirstName'].length;
            buf.write(this.QueryReplies[i]['LastName'], pos);
            pos += this.QueryReplies[i]['LastName'].length;
            buf.write(this.QueryReplies[i]['Group'], pos);
            pos += this.QueryReplies[i]['Group'].length;
            buf.writeUInt8((this.QueryReplies[i]['Online']) ? 1 : 0, pos++);
            buf.writeInt32LE(this.QueryReplies[i]['Reputation'], pos);
            pos += 4;
        }
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
                FirstName: '',
                LastName: '',
                Group: '',
                Online: false,
                Reputation: 0
            };
            newObjQueryReplies['AgentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjQueryReplies['FirstName'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjQueryReplies['LastName'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjQueryReplies['Group'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjQueryReplies['Online'] = (buf.readUInt8(pos++) === 1);
            newObjQueryReplies['Reputation'] = buf.readInt32LE(pos);
            pos += 4;
            this.QueryReplies.push(newObjQueryReplies);
        }
        return pos - startPos;
    }
}
exports.DirPeopleReplyPacket = DirPeopleReplyPacket;
//# sourceMappingURL=DirPeopleReply.js.map