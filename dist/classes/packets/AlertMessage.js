"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AlertMessagePacket {
    constructor() {
        this.name = 'AlertMessage';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901894;
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
        buf.write(this.AlertData['Message'], pos);
        pos += this.AlertData['Message'].length;
        let count = this.AlertInfo.length;
        buf.writeUInt8(this.AlertInfo.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.write(this.AlertInfo[i]['Message'], pos);
            pos += this.AlertInfo[i]['Message'].length;
            buf.write(this.AlertInfo[i]['ExtraParams'], pos);
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
        const newObjAlertData = {
            Message: ''
        };
        newObjAlertData['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        this.AlertData = newObjAlertData;
        let count = buf.readUInt8(pos++);
        this.AlertInfo = [];
        for (let i = 0; i < count; i++) {
            const newObjAlertInfo = {
                Message: '',
                ExtraParams: ''
            };
            newObjAlertInfo['Message'] = buf.toString('utf8', pos, length);
            pos += length;
            newObjAlertInfo['ExtraParams'] = buf.toString('utf8', pos, length);
            pos += length;
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
exports.AlertMessagePacket = AlertMessagePacket;
//# sourceMappingURL=AlertMessage.js.map