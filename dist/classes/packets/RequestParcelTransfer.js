"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RequestParcelTransferPacket {
    constructor() {
        this.name = 'RequestParcelTransfer';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901980;
    }
    getSize() {
        return 110;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Data['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Data['TransactionTime'], pos);
        pos += 4;
        this.Data['SourceID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['DestID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.Data['Flags'], pos++);
        buf.writeInt32LE(this.Data['TransactionType'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['Amount'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['BillableArea'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['ActualArea'], pos);
        pos += 4;
        buf.writeUInt8((this.Data['Final']) ? 1 : 0, pos++);
        this.RegionData['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.RegionData['GridX'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RegionData['GridY'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjData = {
            TransactionID: UUID_1.UUID.zero(),
            TransactionTime: 0,
            SourceID: UUID_1.UUID.zero(),
            DestID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            Flags: 0,
            TransactionType: 0,
            Amount: 0,
            BillableArea: 0,
            ActualArea: 0,
            Final: false
        };
        newObjData['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['TransactionTime'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjData['SourceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['DestID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['Flags'] = buf.readUInt8(pos++);
        newObjData['TransactionType'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['Amount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['BillableArea'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['ActualArea'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['Final'] = (buf.readUInt8(pos++) === 1);
        this.Data = newObjData;
        const newObjRegionData = {
            RegionID: UUID_1.UUID.zero(),
            GridX: 0,
            GridY: 0
        };
        newObjRegionData['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionData['GridX'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegionData['GridY'] = buf.readUInt32LE(pos);
        pos += 4;
        this.RegionData = newObjRegionData;
        return pos - startPos;
    }
}
exports.RequestParcelTransferPacket = RequestParcelTransferPacket;
//# sourceMappingURL=RequestParcelTransfer.js.map