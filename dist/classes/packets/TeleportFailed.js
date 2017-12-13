"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TeleportFailedPacket {
    constructor() {
        this.name = 'TeleportFailed';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901834;
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
        buf.write(this.Info['Reason'], pos);
        pos += this.Info['Reason'].length;
        const count = this.AlertInfo.length;
        buf.writeUInt8(this.AlertInfo.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.write(this.AlertInfo[i]['Message'], pos);
            pos += this.AlertInfo[i]['Message'].length;
            buf.write(this.AlertInfo[i]['ExtraParams'], pos);
            pos += this.AlertInfo[i]['ExtraParams'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjInfo = {
            AgentID: UUID_1.UUID.zero(),
            Reason: ''
        };
        newObjInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['Reason'] = buf.toString('utf8', pos, length);
        pos += length;
        this.Info = newObjInfo;
        const count = buf.readUInt8(pos++);
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
        return pos - startPos;
    }
}
exports.TeleportFailedPacket = TeleportFailedPacket;
//# sourceMappingURL=TeleportFailed.js.map