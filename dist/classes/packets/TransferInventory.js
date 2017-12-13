"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class TransferInventoryPacket {
    constructor() {
        this.name = 'TransferInventory';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902055;
    }
    getSize() {
        return ((17) * this.InventoryBlock.length) + 54;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.InfoBlock['SourceID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InfoBlock['DestID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InfoBlock['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.InventoryBlock.length;
        buf.writeUInt8(this.InventoryBlock.length, pos++);
        for (let i = 0; i < count; i++) {
            this.InventoryBlock[i]['InventoryID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt8(this.InventoryBlock[i]['Type'], pos++);
        }
        buf.writeUInt8((this.ValidationBlock['NeedsValidation']) ? 1 : 0, pos++);
        buf.writeUInt32LE(this.ValidationBlock['EstateID'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjInfoBlock = {
            SourceID: UUID_1.UUID.zero(),
            DestID: UUID_1.UUID.zero(),
            TransactionID: UUID_1.UUID.zero()
        };
        newObjInfoBlock['SourceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfoBlock['DestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfoBlock['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.InfoBlock = newObjInfoBlock;
        const count = buf.readUInt8(pos++);
        this.InventoryBlock = [];
        for (let i = 0; i < count; i++) {
            const newObjInventoryBlock = {
                InventoryID: UUID_1.UUID.zero(),
                Type: 0
            };
            newObjInventoryBlock['InventoryID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjInventoryBlock['Type'] = buf.readInt8(pos++);
            this.InventoryBlock.push(newObjInventoryBlock);
        }
        const newObjValidationBlock = {
            NeedsValidation: false,
            EstateID: 0
        };
        newObjValidationBlock['NeedsValidation'] = (buf.readUInt8(pos++) === 1);
        newObjValidationBlock['EstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        this.ValidationBlock = newObjValidationBlock;
        return pos - startPos;
    }
}
exports.TransferInventoryPacket = TransferInventoryPacket;
//# sourceMappingURL=TransferInventory.js.map