"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GodlikeMessageMessage {
    constructor() {
        this.name = 'GodlikeMessage';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GodlikeMessage;
    }
    getSize() {
        return (this.MethodData['Method'].length + 1) + ((this.calculateVarVarSize(this.ParamList, 'Parameter', 1)) * this.ParamList.length) + 65;
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
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.MethodData['Method'].length, pos++);
        this.MethodData['Method'].copy(buf, pos);
        pos += this.MethodData['Method'].length;
        this.MethodData['Invoice'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.ParamList.length;
        buf.writeUInt8(this.ParamList.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.ParamList[i]['Parameter'].length, pos++);
            this.ParamList[i]['Parameter'].copy(buf, pos);
            pos += this.ParamList[i]['Parameter'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            TransactionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjMethodData = {
            Method: Buffer.allocUnsafe(0),
            Invoice: UUID_1.UUID.zero()
        };
        varLength = buf.readUInt8(pos++);
        newObjMethodData['Method'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjMethodData['Invoice'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.MethodData = newObjMethodData;
        const count = buf.readUInt8(pos++);
        this.ParamList = [];
        for (let i = 0; i < count; i++) {
            const newObjParamList = {
                Parameter: Buffer.allocUnsafe(0)
            };
            varLength = buf.readUInt8(pos++);
            newObjParamList['Parameter'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.ParamList.push(newObjParamList);
        }
        return pos - startPos;
    }
}
exports.GodlikeMessageMessage = GodlikeMessageMessage;
//# sourceMappingURL=GodlikeMessage.js.map