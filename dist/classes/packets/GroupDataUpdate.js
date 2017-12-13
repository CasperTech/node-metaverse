"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class GroupDataUpdatePacket {
    constructor() {
        this.name = 'GroupDataUpdate';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902148;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.AgentGroupData, 'GroupTitle', 1) + 40) * this.AgentGroupData.length) + 1;
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
        const count = this.AgentGroupData.length;
        buf.writeUInt8(this.AgentGroupData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.AgentGroupData[i]['AgentID'].writeToBuffer(buf, pos);
            pos += 16;
            this.AgentGroupData[i]['GroupID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.AgentGroupData[i]['AgentPowers'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.AgentGroupData[i]['AgentPowers'].high, pos);
            pos += 4;
            buf.write(this.AgentGroupData[i]['GroupTitle'], pos);
            pos += this.AgentGroupData[i]['GroupTitle'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const count = buf.readUInt8(pos++);
        this.AgentGroupData = [];
        for (let i = 0; i < count; i++) {
            const newObjAgentGroupData = {
                AgentID: UUID_1.UUID.zero(),
                GroupID: UUID_1.UUID.zero(),
                AgentPowers: Long.ZERO,
                GroupTitle: ''
            };
            newObjAgentGroupData['AgentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjAgentGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjAgentGroupData['AgentPowers'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjAgentGroupData['GroupTitle'] = buf.toString('utf8', pos, length);
            pos += length;
            this.AgentGroupData.push(newObjAgentGroupData);
        }
        return pos - startPos;
    }
}
exports.GroupDataUpdatePacket = GroupDataUpdatePacket;
//# sourceMappingURL=GroupDataUpdate.js.map