"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SetCPURatioMessage {
    constructor() {
        this.name = 'SetCPURatio';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SetCPURatio;
    }
    getSize() {
        return 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.Data['Ratio'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjData = {
            Ratio: 0
        };
        newObjData['Ratio'] = buf.readUInt8(pos++);
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.SetCPURatioMessage = SetCPURatioMessage;
//# sourceMappingURL=SetCPURatio.js.map