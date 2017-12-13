"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AvatarPickerReplyPacket {
    constructor() {
        this.name = 'AvatarPickerReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901788;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.Data, 'FirstName', 1) + this.calculateVarVarSize(this.Data, 'LastName', 1) + 16) * this.Data.length) + 33;
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
        this.AgentData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.Data.length;
        buf.writeUInt8(this.Data.length, pos++);
        for (let i = 0; i < count; i++) {
            this.Data[i]['AvatarID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.write(this.Data[i]['FirstName'], pos);
            pos += this.Data[i]['FirstName'].length;
            buf.write(this.Data[i]['LastName'], pos);
            pos += this.Data[i]['LastName'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            QueryID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.Data = [];
        for (let i = 0; i < count; i++) {
            const newObjData = {
                AvatarID: UUID_1.UUID.zero(),
                FirstName: '',
                LastName: ''
            };
            newObjData['AvatarID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjData['FirstName'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjData['LastName'] = buf.toString('utf8', pos, length);
            pos += length;
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.AvatarPickerReplyPacket = AvatarPickerReplyPacket;
//# sourceMappingURL=AvatarPickerReply.js.map