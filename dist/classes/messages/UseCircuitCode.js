"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class UseCircuitCodeMessage {
    constructor() {
        this.name = 'UseCircuitCode';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.UseCircuitCode;
    }
    getSize() {
        return 36;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.CircuitCode['Code'], pos);
        pos += 4;
        this.CircuitCode['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.CircuitCode['ID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjCircuitCode = {
            Code: 0,
            SessionID: UUID_1.UUID.zero(),
            ID: UUID_1.UUID.zero()
        };
        newObjCircuitCode['Code'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjCircuitCode['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjCircuitCode['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.CircuitCode = newObjCircuitCode;
        return pos - startPos;
    }
}
exports.UseCircuitCodeMessage = UseCircuitCodeMessage;
//# sourceMappingURL=UseCircuitCode.js.map