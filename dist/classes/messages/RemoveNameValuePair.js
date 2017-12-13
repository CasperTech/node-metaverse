"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RemoveNameValuePairMessage {
    constructor() {
        this.name = 'RemoveNameValuePair';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RemoveNameValuePair;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.NameValueData, 'NVPair', 2)) * this.NameValueData.length) + 17;
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
        this.TaskData['ID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.NameValueData.length;
        buf.writeUInt8(this.NameValueData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt16LE(this.NameValueData[i]['NVPair'].length, pos);
            pos += 2;
            this.NameValueData[i]['NVPair'].copy(buf, pos);
            pos += this.NameValueData[i]['NVPair'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjTaskData = {
            ID: UUID_1.UUID.zero()
        };
        newObjTaskData['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.TaskData = newObjTaskData;
        const count = buf.readUInt8(pos++);
        this.NameValueData = [];
        for (let i = 0; i < count; i++) {
            const newObjNameValueData = {
                NVPair: Buffer.allocUnsafe(0)
            };
            varLength = buf.readUInt16LE(pos);
            pos += 2;
            newObjNameValueData['NVPair'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.NameValueData.push(newObjNameValueData);
        }
        return pos - startPos;
    }
}
exports.RemoveNameValuePairMessage = RemoveNameValuePairMessage;
//# sourceMappingURL=RemoveNameValuePair.js.map