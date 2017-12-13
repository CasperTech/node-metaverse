"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TeleportFailedMessage {
    constructor() {
        this.name = 'TeleportFailed';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TeleportFailed;
    }
    getSize() {
        return (this.Info['Reason'].length + 1) + ((this.calculateVarVarSize(this.AlertInfo, 'Message', 1) + this.calculateVarVarSize(this.AlertInfo, 'ExtraParams', 1)) * this.AlertInfo.length) + 17;
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
        this.Info['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.Info['Reason'].length, pos++);
        this.Info['Reason'].copy(buf, pos);
        pos += this.Info['Reason'].length;
        const count = this.AlertInfo.length;
        buf.writeUInt8(this.AlertInfo.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8(this.AlertInfo[i]['Message'].length, pos++);
            this.AlertInfo[i]['Message'].copy(buf, pos);
            pos += this.AlertInfo[i]['Message'].length;
            buf.writeUInt8(this.AlertInfo[i]['ExtraParams'].length, pos++);
            this.AlertInfo[i]['ExtraParams'].copy(buf, pos);
            pos += this.AlertInfo[i]['ExtraParams'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjInfo = {
            AgentID: UUID_1.UUID.zero(),
            Reason: Buffer.allocUnsafe(0)
        };
        newObjInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjInfo['Reason'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.Info = newObjInfo;
        const count = buf.readUInt8(pos++);
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
        return pos - startPos;
    }
}
exports.TeleportFailedMessage = TeleportFailedMessage;
//# sourceMappingURL=TeleportFailed.js.map