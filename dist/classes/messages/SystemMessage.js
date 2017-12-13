"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SystemMessageMessage {
    constructor() {
        this.name = 'SystemMessage';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SystemMessage;
    }
    getSize() {
        return (this.MethodData['Method'].length + 1) + ((this.calculateVarVarSize(this.ParamList, 'Parameter', 1)) * this.ParamList.length) + 49;
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
        buf.writeUInt8(this.MethodData['Method'].length, pos++);
        this.MethodData['Method'].copy(buf, pos);
        pos += this.MethodData['Method'].length;
        this.MethodData['Invoice'].writeToBuffer(buf, pos);
        pos += 16;
        this.MethodData['Digest'].copy(buf, pos);
        pos += 32;
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
        const newObjMethodData = {
            Method: Buffer.allocUnsafe(0),
            Invoice: UUID_1.UUID.zero(),
            Digest: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt8(pos++);
        newObjMethodData['Method'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjMethodData['Invoice'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMethodData['Digest'] = buf.slice(pos, pos + 32);
        pos += 32;
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
exports.SystemMessageMessage = SystemMessageMessage;
//# sourceMappingURL=SystemMessage.js.map