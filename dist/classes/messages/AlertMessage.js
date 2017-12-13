"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AlertMessageMessage {
    constructor() {
        this.name = 'AlertMessage';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AlertMessage;
    }
    getSize() {
        return (this.AlertData['Message'].length + 1) + ((this.calculateVarVarSize(this.AlertInfo, 'Message', 1) + this.calculateVarVarSize(this.AlertInfo, 'ExtraParams', 1)) * this.AlertInfo.length) + ((16) * this.AgentInfo.length) + 2;
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
        buf.writeUInt8(this.AlertData['Message'].length, pos++);
        this.AlertData['Message'].copy(buf, pos);
        pos += this.AlertData['Message'].length;
        let count = this.AlertInfo.length;
        buf.writeUInt8(this.AlertInfo.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.AlertInfo[i]['Message'].length, pos++);
            this.AlertInfo[i]['Message'].copy(buf, pos);
            pos += this.AlertInfo[i]['Message'].length;
            buf.writeUInt8(this.AlertInfo[i]['ExtraParams'].length, pos++);
            this.AlertInfo[i]['ExtraParams'].copy(buf, pos);
            pos += this.AlertInfo[i]['ExtraParams'].length;
        }
        count = this.AgentInfo.length;
        buf.writeUInt8(this.AgentInfo.length, pos++);
        for (let i = 0; i < count; i++) {
            this.AgentInfo[i]['AgentID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAlertData = {
            Message: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt8(pos++);
        newObjAlertData['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.AlertData = newObjAlertData;
        let count = buf.readUInt8(pos++);
        this.AlertInfo = [];
        for (let i = 0; i < count; i++) {
            const newObjAlertInfo = {
                Message: Buffer.allocUnsafe(0),
                ExtraParams: Buffer.allocUnsafe(0)
            };
            varLength = buf.readUInt8(pos++);
            newObjAlertInfo['Message'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjAlertInfo['ExtraParams'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.AlertInfo.push(newObjAlertInfo);
        }
        count = buf.readUInt8(pos++);
        this.AgentInfo = [];
        for (let i = 0; i < count; i++) {
            const newObjAgentInfo = {
                AgentID: UUID_1.UUID.zero()
            };
            newObjAgentInfo['AgentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.AgentInfo.push(newObjAgentInfo);
        }
        return pos - startPos;
    }
}
exports.AlertMessageMessage = AlertMessageMessage;
//# sourceMappingURL=AlertMessage.js.map