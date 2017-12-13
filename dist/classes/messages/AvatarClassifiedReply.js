"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AvatarClassifiedReplyMessage {
    constructor() {
        this.name = 'AvatarClassifiedReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AvatarClassifiedReply;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.Data, 'Name', 1) + 16) * this.Data.length) + 33;
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
            this.Data[i]['ClassifiedID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.Data[i]['Name'].length, pos++);
            this.Data[i]['Name'].copy(buf, pos);
            pos += this.Data[i]['Name'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
                ClassifiedID: UUID_1.UUID.zero(),
                Name: Buffer.allocUnsafe(0)
            };
            newObjData['ClassifiedID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.AvatarClassifiedReplyMessage = AvatarClassifiedReplyMessage;
//# sourceMappingURL=AvatarClassifiedReply.js.map