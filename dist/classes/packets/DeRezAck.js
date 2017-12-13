"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class DeRezAckPacket {
    constructor() {
        this.name = 'DeRezAck';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902052;
    }
    getSize() {
        return 17;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.TransactionData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.TransactionData['Success']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjTransactionData = {
            TransactionID: UUID_1.UUID.zero(),
            Success: false
        };
        newObjTransactionData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjTransactionData['Success'] = (buf.readUInt8(pos++) === 1);
        this.TransactionData = newObjTransactionData;
        return pos - startPos;
    }
}
exports.DeRezAckPacket = DeRezAckPacket;
//# sourceMappingURL=DeRezAck.js.map