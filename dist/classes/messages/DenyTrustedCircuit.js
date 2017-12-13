"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class DenyTrustedCircuitMessage {
    constructor() {
        this.name = 'DenyTrustedCircuit';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.DenyTrustedCircuit;
    }
    getSize() {
        return 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.DataBlock['EndPointID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjDataBlock = {
            EndPointID: UUID_1.UUID.zero()
        };
        newObjDataBlock['EndPointID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.DataBlock = newObjDataBlock;
        return pos - startPos;
    }
}
exports.DenyTrustedCircuitMessage = DenyTrustedCircuitMessage;
//# sourceMappingURL=DenyTrustedCircuit.js.map