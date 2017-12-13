"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class EconomyDataMessage {
    constructor() {
        this.name = 'EconomyData';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.EconomyData;
    }
    getSize() {
        return 68;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.Info['ObjectCapacity'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['ObjectCount'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['PriceEnergyUnit'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['PriceObjectClaim'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['PricePublicObjectDecay'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['PricePublicObjectDelete'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['PriceParcelClaim'], pos);
        pos += 4;
        buf.writeFloatLE(this.Info['PriceParcelClaimFactor'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['PriceUpload'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['PriceRentLight'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['TeleportMinPrice'], pos);
        pos += 4;
        buf.writeFloatLE(this.Info['TeleportPriceExponent'], pos);
        pos += 4;
        buf.writeFloatLE(this.Info['EnergyEfficiency'], pos);
        pos += 4;
        buf.writeFloatLE(this.Info['PriceObjectRent'], pos);
        pos += 4;
        buf.writeFloatLE(this.Info['PriceObjectScaleFactor'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['PriceParcelRent'], pos);
        pos += 4;
        buf.writeInt32LE(this.Info['PriceGroupCreate'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjInfo = {
            ObjectCapacity: 0,
            ObjectCount: 0,
            PriceEnergyUnit: 0,
            PriceObjectClaim: 0,
            PricePublicObjectDecay: 0,
            PricePublicObjectDelete: 0,
            PriceParcelClaim: 0,
            PriceParcelClaimFactor: 0,
            PriceUpload: 0,
            PriceRentLight: 0,
            TeleportMinPrice: 0,
            TeleportPriceExponent: 0,
            EnergyEfficiency: 0,
            PriceObjectRent: 0,
            PriceObjectScaleFactor: 0,
            PriceParcelRent: 0,
            PriceGroupCreate: 0
        };
        newObjInfo['ObjectCapacity'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['ObjectCount'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['PriceEnergyUnit'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['PriceObjectClaim'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['PricePublicObjectDecay'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['PricePublicObjectDelete'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['PriceParcelClaim'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['PriceParcelClaimFactor'] = buf.readFloatLE(pos);
        pos += 4;
        newObjInfo['PriceUpload'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['PriceRentLight'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['TeleportMinPrice'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['TeleportPriceExponent'] = buf.readFloatLE(pos);
        pos += 4;
        newObjInfo['EnergyEfficiency'] = buf.readFloatLE(pos);
        pos += 4;
        newObjInfo['PriceObjectRent'] = buf.readFloatLE(pos);
        pos += 4;
        newObjInfo['PriceObjectScaleFactor'] = buf.readFloatLE(pos);
        pos += 4;
        newObjInfo['PriceParcelRent'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInfo['PriceGroupCreate'] = buf.readInt32LE(pos);
        pos += 4;
        this.Info = newObjInfo;
        return pos - startPos;
    }
}
exports.EconomyDataMessage = EconomyDataMessage;
//# sourceMappingURL=EconomyData.js.map