"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ScriptControlChangeMessage {
    constructor() {
        this.name = 'ScriptControlChange';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ScriptControlChange;
    }
    getSize() {
        return ((6) * this.Data.length) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = this.Data.length;
        buf.writeUInt8(this.Data.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt8((this.Data[i]['TakeControls']) ? 1 : 0, pos++);
            buf.writeUInt32LE(this.Data[i]['Controls'], pos);
            pos += 4;
            buf.writeUInt8((this.Data[i]['PassToAgent']) ? 1 : 0, pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const count = buf.readUInt8(pos++);
        this.Data = [];
        for (let i = 0; i < count; i++) {
            const newObjData = {
                TakeControls: false,
                Controls: 0,
                PassToAgent: false
            };
            newObjData['TakeControls'] = (buf.readUInt8(pos++) === 1);
            newObjData['Controls'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjData['PassToAgent'] = (buf.readUInt8(pos++) === 1);
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.ScriptControlChangeMessage = ScriptControlChangeMessage;
//# sourceMappingURL=ScriptControlChange.js.map