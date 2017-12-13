"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TransferInventoryAckMessage {
    constructor() {
        this.name = 'TransferInventoryAck';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TransferInventoryAck;
    }
    getSize() {
        return 32;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.InfoBlock['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InfoBlock['InventoryID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjInfoBlock = {
            TransactionID: UUID_1.UUID.zero(),
            InventoryID: UUID_1.UUID.zero()
        };
        newObjInfoBlock['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfoBlock['InventoryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.InfoBlock = newObjInfoBlock;
        return pos - startPos;
    }
}
exports.TransferInventoryAckMessage = TransferInventoryAckMessage;
//# sourceMappingURL=TransferInventoryAck.js.map