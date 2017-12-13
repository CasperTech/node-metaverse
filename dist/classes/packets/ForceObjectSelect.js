"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
class ForceObjectSelectPacket {
    constructor() {
        this.name = 'ForceObjectSelect';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901965;
    }
    getSize() {
        return ((4) * this.Data.length) + 2;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8((this.Header['ResetList']) ? 1 : 0, pos++);
        const count = this.Data.length;
        buf.writeUInt8(this.Data.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.Data[i]['LocalID'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjHeader = {
            ResetList: false
        };
        newObjHeader['ResetList'] = (buf.readUInt8(pos++) === 1);
        this.Header = newObjHeader;
        const count = buf.readUInt8(pos++);
        this.Data = [];
        for (let i = 0; i < count; i++) {
            const newObjData = {
                LocalID: 0
            };
            newObjData['LocalID'] = buf.readUInt32LE(pos);
            pos += 4;
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.ForceObjectSelectPacket = ForceObjectSelectPacket;
//# sourceMappingURL=ForceObjectSelect.js.map