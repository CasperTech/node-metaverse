"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class GetScriptRunningMessage {
    constructor() {
        this.name = 'GetScriptRunning';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.GetScriptRunning;
    }
    getSize() {
        return 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Script['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Script['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjScript = {
            ObjectID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero()
        };
        newObjScript['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjScript['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Script = newObjScript;
        return pos - startPos;
    }
}
exports.GetScriptRunningMessage = GetScriptRunningMessage;
//# sourceMappingURL=GetScriptRunning.js.map