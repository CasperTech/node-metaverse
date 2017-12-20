"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ParcelRenameMessage {
    constructor() {
        this.name = 'ParcelRename';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ParcelRename;
    }
    getSize() {
        return this.calculateVarVarSize(this.ParcelData, 'NewName', 1) + ((16) * this.ParcelData.length) + 1;
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
        const count = this.ParcelData.length;
        buf.writeUInt8(this.ParcelData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ParcelData[i]['ParcelID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.ParcelData[i]['NewName'].length, pos++);
            this.ParcelData[i]['NewName'].copy(buf, pos);
            pos += this.ParcelData[i]['NewName'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const count = buf.readUInt8(pos++);
        this.ParcelData = [];
        for (let i = 0; i < count; i++) {
            const newObjParcelData = {
                ParcelID: UUID_1.UUID.zero(),
                NewName: Buffer.allocUnsafe(0)
            };
            newObjParcelData['ParcelID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjParcelData['NewName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.ParcelData.push(newObjParcelData);
        }
        return pos - startPos;
    }
}
exports.ParcelRenameMessage = ParcelRenameMessage;
//# sourceMappingURL=ParcelRename.js.map