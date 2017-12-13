"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ParcelPropertiesMessage {
    constructor() {
        this.name = 'ParcelProperties';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = Message_1.Message.ParcelProperties;
    }
    getSize() {
        return (this.ParcelData['Bitmap'].length + 2 + this.ParcelData['Name'].length + 1 + this.ParcelData['Desc'].length + 1 + this.ParcelData['MusicURL'].length + 1 + this.ParcelData['MediaURL'].length + 1) + 240;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.ParcelData['RequestResult'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['SequenceID'], pos);
        pos += 4;
        buf.writeUInt8((this.ParcelData['SnapSelection']) ? 1 : 0, pos++);
        buf.writeInt32LE(this.ParcelData['SelfCount'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['OtherCount'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['PublicCount'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['LocalID'], pos);
        pos += 4;
        this.ParcelData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.ParcelData['IsGroupOwned']) ? 1 : 0, pos++);
        buf.writeUInt32LE(this.ParcelData['AuctionID'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['ClaimDate'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['ClaimPrice'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['RentPrice'], pos);
        pos += 4;
        this.ParcelData['AABBMin'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ParcelData['AABBMax'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt16LE(this.ParcelData['Bitmap'].length, pos);
        pos += 2;
        this.ParcelData['Bitmap'].copy(buf, pos);
        pos += this.ParcelData['Bitmap'].length;
        buf.writeInt32LE(this.ParcelData['Area'], pos);
        pos += 4;
        buf.writeUInt8(this.ParcelData['Status'], pos++);
        buf.writeInt32LE(this.ParcelData['SimWideMaxPrims'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['SimWideTotalPrims'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['MaxPrims'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['TotalPrims'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['OwnerPrims'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['GroupPrims'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['OtherPrims'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['SelectedPrims'], pos);
        pos += 4;
        buf.writeFloatLE(this.ParcelData['ParcelPrimBonus'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['OtherCleanTime'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ParcelData['ParcelFlags'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['SalePrice'], pos);
        pos += 4;
        buf.writeUInt8(this.ParcelData['Name'].length, pos++);
        this.ParcelData['Name'].copy(buf, pos);
        pos += this.ParcelData['Name'].length;
        buf.writeUInt8(this.ParcelData['Desc'].length, pos++);
        this.ParcelData['Desc'].copy(buf, pos);
        pos += this.ParcelData['Desc'].length;
        buf.writeUInt8(this.ParcelData['MusicURL'].length, pos++);
        this.ParcelData['MusicURL'].copy(buf, pos);
        pos += this.ParcelData['MusicURL'].length;
        buf.writeUInt8(this.ParcelData['MediaURL'].length, pos++);
        this.ParcelData['MediaURL'].copy(buf, pos);
        pos += this.ParcelData['MediaURL'].length;
        this.ParcelData['MediaID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ParcelData['MediaAutoScale'], pos++);
        this.ParcelData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.ParcelData['PassPrice'], pos);
        pos += 4;
        buf.writeFloatLE(this.ParcelData['PassHours'], pos);
        pos += 4;
        buf.writeUInt8(this.ParcelData['Category'], pos++);
        this.ParcelData['AuthBuyerID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ParcelData['SnapshotID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ParcelData['UserLocation'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ParcelData['UserLookAt'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt8(this.ParcelData['LandingType'], pos++);
        buf.writeUInt8((this.ParcelData['RegionPushOverride']) ? 1 : 0, pos++);
        buf.writeUInt8((this.ParcelData['RegionDenyAnonymous']) ? 1 : 0, pos++);
        buf.writeUInt8((this.ParcelData['RegionDenyIdentified']) ? 1 : 0, pos++);
        buf.writeUInt8((this.ParcelData['RegionDenyTransacted']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AgeVerificationBlock['RegionDenyAgeUnverified']) ? 1 : 0, pos++);
        buf.writeUInt8((this.RegionAllowAccessBlock['RegionAllowAccessOverride']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjParcelData = {
            RequestResult: 0,
            SequenceID: 0,
            SnapSelection: false,
            SelfCount: 0,
            OtherCount: 0,
            PublicCount: 0,
            LocalID: 0,
            OwnerID: UUID_1.UUID.zero(),
            IsGroupOwned: false,
            AuctionID: 0,
            ClaimDate: 0,
            ClaimPrice: 0,
            RentPrice: 0,
            AABBMin: Vector3_1.Vector3.getZero(),
            AABBMax: Vector3_1.Vector3.getZero(),
            Bitmap: Buffer.allocUnsafe(0),
            Area: 0,
            Status: 0,
            SimWideMaxPrims: 0,
            SimWideTotalPrims: 0,
            MaxPrims: 0,
            TotalPrims: 0,
            OwnerPrims: 0,
            GroupPrims: 0,
            OtherPrims: 0,
            SelectedPrims: 0,
            ParcelPrimBonus: 0,
            OtherCleanTime: 0,
            ParcelFlags: 0,
            SalePrice: 0,
            Name: Buffer.allocUnsafe(0),
            Desc: Buffer.allocUnsafe(0),
            MusicURL: Buffer.allocUnsafe(0),
            MediaURL: Buffer.allocUnsafe(0),
            MediaID: UUID_1.UUID.zero(),
            MediaAutoScale: 0,
            GroupID: UUID_1.UUID.zero(),
            PassPrice: 0,
            PassHours: 0,
            Category: 0,
            AuthBuyerID: UUID_1.UUID.zero(),
            SnapshotID: UUID_1.UUID.zero(),
            UserLocation: Vector3_1.Vector3.getZero(),
            UserLookAt: Vector3_1.Vector3.getZero(),
            LandingType: 0,
            RegionPushOverride: false,
            RegionDenyAnonymous: false,
            RegionDenyIdentified: false,
            RegionDenyTransacted: false
        };
        newObjParcelData['RequestResult'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['SequenceID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['SnapSelection'] = (buf.readUInt8(pos++) === 1);
        newObjParcelData['SelfCount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['OtherCount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['PublicCount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['LocalID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['IsGroupOwned'] = (buf.readUInt8(pos++) === 1);
        newObjParcelData['AuctionID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjParcelData['ClaimDate'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['ClaimPrice'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['RentPrice'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['AABBMin'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjParcelData['AABBMax'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjParcelData['Bitmap'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjParcelData['Area'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['Status'] = buf.readUInt8(pos++);
        newObjParcelData['SimWideMaxPrims'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['SimWideTotalPrims'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['MaxPrims'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['TotalPrims'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['OwnerPrims'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['GroupPrims'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['OtherPrims'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['SelectedPrims'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['ParcelPrimBonus'] = buf.readFloatLE(pos);
        pos += 4;
        newObjParcelData['OtherCleanTime'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['ParcelFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjParcelData['SalePrice'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjParcelData['Name'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjParcelData['Desc'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjParcelData['MusicURL'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjParcelData['MediaURL'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjParcelData['MediaID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['MediaAutoScale'] = buf.readUInt8(pos++);
        newObjParcelData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['PassPrice'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['PassHours'] = buf.readFloatLE(pos);
        pos += 4;
        newObjParcelData['Category'] = buf.readUInt8(pos++);
        newObjParcelData['AuthBuyerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['SnapshotID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['UserLocation'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjParcelData['UserLookAt'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjParcelData['LandingType'] = buf.readUInt8(pos++);
        newObjParcelData['RegionPushOverride'] = (buf.readUInt8(pos++) === 1);
        newObjParcelData['RegionDenyAnonymous'] = (buf.readUInt8(pos++) === 1);
        newObjParcelData['RegionDenyIdentified'] = (buf.readUInt8(pos++) === 1);
        newObjParcelData['RegionDenyTransacted'] = (buf.readUInt8(pos++) === 1);
        this.ParcelData = newObjParcelData;
        const newObjAgeVerificationBlock = {
            RegionDenyAgeUnverified: false
        };
        newObjAgeVerificationBlock['RegionDenyAgeUnverified'] = (buf.readUInt8(pos++) === 1);
        this.AgeVerificationBlock = newObjAgeVerificationBlock;
        const newObjRegionAllowAccessBlock = {
            RegionAllowAccessOverride: false
        };
        newObjRegionAllowAccessBlock['RegionAllowAccessOverride'] = (buf.readUInt8(pos++) === 1);
        this.RegionAllowAccessBlock = newObjRegionAllowAccessBlock;
        return pos - startPos;
    }
}
exports.ParcelPropertiesMessage = ParcelPropertiesMessage;
//# sourceMappingURL=ParcelProperties.js.map