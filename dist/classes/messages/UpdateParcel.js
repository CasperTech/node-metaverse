"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class UpdateParcelMessage {
    constructor() {
        this.name = 'UpdateParcel';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.UpdateParcel;
    }
    getSize() {
        return (this.ParcelData['Name'].length + 1 + this.ParcelData['Description'].length + 1 + this.ParcelData['MusicURL'].length + 1) + 111;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.ParcelData['ParcelID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.ParcelData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['RegionHandle'].high, pos);
        pos += 4;
        this.ParcelData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.ParcelData['GroupOwned']) ? 1 : 0, pos++);
        buf.writeUInt8(this.ParcelData['Status'], pos++);
        buf.writeUInt8(this.ParcelData['Name'].length, pos++);
        this.ParcelData['Name'].copy(buf, pos);
        pos += this.ParcelData['Name'].length;
        buf.writeUInt8(this.ParcelData['Description'].length, pos++);
        this.ParcelData['Description'].copy(buf, pos);
        pos += this.ParcelData['Description'].length;
        buf.writeUInt8(this.ParcelData['MusicURL'].length, pos++);
        this.ParcelData['MusicURL'].copy(buf, pos);
        pos += this.ParcelData['MusicURL'].length;
        buf.writeFloatLE(this.ParcelData['RegionX'], pos);
        pos += 4;
        buf.writeFloatLE(this.ParcelData['RegionY'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['ActualArea'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['BillableArea'], pos);
        pos += 4;
        buf.writeUInt8((this.ParcelData['ShowDir']) ? 1 : 0, pos++);
        buf.writeUInt8((this.ParcelData['IsForSale']) ? 1 : 0, pos++);
        buf.writeUInt8(this.ParcelData['Category'], pos++);
        this.ParcelData['SnapshotID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ParcelData['UserLocation'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeInt32LE(this.ParcelData['SalePrice'], pos);
        pos += 4;
        this.ParcelData['AuthorizedBuyerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.ParcelData['AllowPublish']) ? 1 : 0, pos++);
        buf.writeUInt8((this.ParcelData['MaturePublish']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjParcelData = {
            ParcelID: UUID_1.UUID.zero(),
            RegionHandle: Long.ZERO,
            OwnerID: UUID_1.UUID.zero(),
            GroupOwned: false,
            Status: 0,
            Name: Buffer.allocUnsafe(0),
            Description: Buffer.allocUnsafe(0),
            MusicURL: Buffer.allocUnsafe(0),
            RegionX: 0,
            RegionY: 0,
            ActualArea: 0,
            BillableArea: 0,
            ShowDir: false,
            IsForSale: false,
            Category: 0,
            SnapshotID: UUID_1.UUID.zero(),
            UserLocation: Vector3_1.Vector3.getZero(),
            SalePrice: 0,
            AuthorizedBuyerID: UUID_1.UUID.zero(),
            AllowPublish: false,
            MaturePublish: false
        };
        newObjParcelData['ParcelID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        newObjParcelData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['GroupOwned'] = (buf.readUInt8(pos++) === 1);
        newObjParcelData['Status'] = buf.readUInt8(pos++);
        varLength = buf.readUInt8(pos++);
        newObjParcelData['Name'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjParcelData['Description'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjParcelData['MusicURL'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjParcelData['RegionX'] = buf.readFloatLE(pos);
        pos += 4;
        newObjParcelData['RegionY'] = buf.readFloatLE(pos);
        pos += 4;
        newObjParcelData['ActualArea'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['BillableArea'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['ShowDir'] = (buf.readUInt8(pos++) === 1);
        newObjParcelData['IsForSale'] = (buf.readUInt8(pos++) === 1);
        newObjParcelData['Category'] = buf.readUInt8(pos++);
        newObjParcelData['SnapshotID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['UserLocation'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjParcelData['SalePrice'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['AuthorizedBuyerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['AllowPublish'] = (buf.readUInt8(pos++) === 1);
        newObjParcelData['MaturePublish'] = (buf.readUInt8(pos++) === 1);
        this.ParcelData = newObjParcelData;
        return pos - startPos;
    }
}
exports.UpdateParcelMessage = UpdateParcelMessage;
//# sourceMappingURL=UpdateParcel.js.map