"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AvatarPicksReplyPacket {
    constructor() {
        this.name = 'AvatarPicksReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901938;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.Data, 'PickName', 1) + 16) * this.Data.length) + 33;
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
        this.AgentData['TargetID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.Data.length;
        buf.writeUInt8(this.Data.length, pos++);
        for (let i = 0; i < count; i++) {
            this.Data[i]['PickID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.write(this.Data[i]['PickName'], pos);
            pos += this.Data[i]['PickName'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            TargetID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['TargetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.Data = [];
        for (let i = 0; i < count; i++) {
            const newObjData = {
                PickID: UUID_1.UUID.zero(),
                PickName: ''
            };
            newObjData['PickID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjData['PickName'] = buf.toString('utf8', pos, length);
            pos += length;
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.AvatarPicksReplyPacket = AvatarPicksReplyPacket;
//# sourceMappingURL=AvatarPicksReply.js.map