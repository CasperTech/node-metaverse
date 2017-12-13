"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TransferInventoryAckPacket {
    constructor() {
        this.name = 'TransferInventoryAck';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902056;
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
exports.TransferInventoryAckPacket = TransferInventoryAckPacket;
//# sourceMappingURL=TransferInventoryAck.js.map