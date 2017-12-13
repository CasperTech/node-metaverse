"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AgentGroupDataUpdatePacket {
    constructor() {
        this.name = 'AgentGroupDataUpdate';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902149;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.GroupData, 'GroupName', 1) + 45) * this.GroupData.length) + 17;
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
        const count = this.GroupData.length;
        buf.writeUInt8(this.GroupData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.GroupData[i]['GroupID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.GroupData[i]['GroupPowers'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.GroupData[i]['GroupPowers'].high, pos);
            pos += 4;
            buf.writeUInt8((this.GroupData[i]['AcceptNotices']) ? 1 : 0, pos++);
            this.GroupData[i]['GroupInsigniaID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.GroupData[i]['Contribution'], pos);
            pos += 4;
            buf.write(this.GroupData[i]['GroupName'], pos);
            pos += this.GroupData[i]['GroupName'].length;
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
        const count = buf.readUInt8(pos++);
        this.GroupData = [];
        for (let i = 0; i < count; i++) {
            const newObjGroupData = {
                GroupID: UUID_1.UUID.zero(),
                GroupPowers: Long.ZERO,
                AcceptNotices: false,
                GroupInsigniaID: UUID_1.UUID.zero(),
                Contribution: 0,
                GroupName: ''
            };
            newObjGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjGroupData['GroupPowers'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjGroupData['AcceptNotices'] = (buf.readUInt8(pos++) === 1);
            newObjGroupData['GroupInsigniaID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjGroupData['Contribution'] = buf.readInt32LE(pos);
            pos += 4;
            newObjGroupData['GroupName'] = buf.toString('utf8', pos, length);
            pos += length;
            this.GroupData.push(newObjGroupData);
        }
        return pos - startPos;
    }
}
exports.AgentGroupDataUpdatePacket = AgentGroupDataUpdatePacket;
//# sourceMappingURL=AgentGroupDataUpdate.js.map