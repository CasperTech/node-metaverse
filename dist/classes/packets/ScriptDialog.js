"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ScriptDialogPacket {
    constructor() {
        this.name = 'ScriptDialog';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901950;
    }
    getSize() {
        return (this.Data['FirstName'].length + 1 + this.Data['LastName'].length + 1 + this.Data['ObjectName'].length + 1 + this.Data['Message'].length + 2) + ((this.calculateVarVarSize(this.Buttons, 'ButtonLabel', 1)) * this.Buttons.length) + ((16) * this.OwnerData.length) + 38;
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
        this.Data['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.Data['FirstName'], pos);
        pos += this.Data['FirstName'].length;
        buf.write(this.Data['LastName'], pos);
        pos += this.Data['LastName'].length;
        buf.write(this.Data['ObjectName'], pos);
        pos += this.Data['ObjectName'].length;
        buf.write(this.Data['Message'], pos);
        pos += this.Data['Message'].length;
        buf.writeInt32LE(this.Data['ChatChannel'], pos);
        pos += 4;
        this.Data['ImageID'].writeToBuffer(buf, pos);
        pos += 16;
        let count = this.Buttons.length;
        buf.writeUInt8(this.Buttons.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.write(this.Buttons[i]['ButtonLabel'], pos);
            pos += this.Buttons[i]['ButtonLabel'].length;
        }
        count = this.OwnerData.length;
        buf.writeUInt8(this.OwnerData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.OwnerData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjData = {
            ObjectID: UUID_1.UUID.zero(),
            FirstName: '',
            LastName: '',
            ObjectName: '',
            Message: '',
            ChatChannel: 0,
            ImageID: UUID_1.UUID.zero()
        };
        newObjData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['FirstName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['LastName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['ObjectName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['ChatChannel'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['ImageID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Data = newObjData;
        let count = buf.readUInt8(pos++);
        this.Buttons = [];
        for (let i = 0; i < count; i++) {
            const newObjButtons = {
                ButtonLabel: ''
            };
            newObjButtons['ButtonLabel'] = buf.toString('utf8', pos, length);
            pos += length;
            this.Buttons.push(newObjButtons);
        }
        count = buf.readUInt8(pos++);
        this.OwnerData = [];
        for (let i = 0; i < count; i++) {
            const newObjOwnerData = {
                OwnerID: UUID_1.UUID.zero()
            };
            newObjOwnerData['OwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.OwnerData.push(newObjOwnerData);
        }
        return pos - startPos;
    }
}
exports.ScriptDialogPacket = ScriptDialogPacket;
//# sourceMappingURL=ScriptDialog.js.map