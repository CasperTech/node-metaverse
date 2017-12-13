"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RegionInfoMessage {
    constructor() {
        this.name = 'RegionInfo';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RegionInfo;
    }
    getSize() {
        return (this.RegionInfo['SimName'].length + 1) + (this.RegionInfo2['ProductSKU'].length + 1 + this.RegionInfo2['ProductName'].length + 1) + ((8) * this.RegionInfo3.length) + 96;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.RegionInfo['SimName'].length, pos++);
        this.RegionInfo['SimName'].copy(buf, pos);
        pos += this.RegionInfo['SimName'].length;
        buf.writeUInt32LE(this.RegionInfo['EstateID'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RegionInfo['ParentEstateID'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RegionInfo['RegionFlags'], pos);
        pos += 4;
        buf.writeUInt8(this.RegionInfo['SimAccess'], pos++);
        buf.writeUInt8(this.RegionInfo['MaxAgents'], pos++);
        buf.writeFloatLE(this.RegionInfo['BillableFactor'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['ObjectBonusFactor'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['WaterHeight'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['TerrainRaiseLimit'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['TerrainLowerLimit'], pos);
        pos += 4;
        buf.writeInt32LE(this.RegionInfo['PricePerMeter'], pos);
        pos += 4;
        buf.writeInt32LE(this.RegionInfo['RedirectGridX'], pos);
        pos += 4;
        buf.writeInt32LE(this.RegionInfo['RedirectGridY'], pos);
        pos += 4;
        buf.writeUInt8((this.RegionInfo['UseEstateSun']) ? 1 : 0, pos++);
        buf.writeFloatLE(this.RegionInfo['SunHour'], pos);
        pos += 4;
        buf.writeUInt8(this.RegionInfo2['ProductSKU'].length, pos++);
        this.RegionInfo2['ProductSKU'].copy(buf, pos);
        pos += this.RegionInfo2['ProductSKU'].length;
        buf.writeUInt8(this.RegionInfo2['ProductName'].length, pos++);
        this.RegionInfo2['ProductName'].copy(buf, pos);
        pos += this.RegionInfo2['ProductName'].length;
        buf.writeUInt32LE(this.RegionInfo2['MaxAgents32'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RegionInfo2['HardMaxAgents'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RegionInfo2['HardMaxObjects'], pos);
        pos += 4;
        const count = this.RegionInfo3.length;
        buf.writeUInt8(this.RegionInfo3.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeInt32LE(this.RegionInfo3[i]['RegionFlagsExtended'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.RegionInfo3[i]['RegionFlagsExtended'].high, pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjRegionInfo = {
            SimName: Buffer.allocUnsafe(0),
            EstateID: 0,
            ParentEstateID: 0,
            RegionFlags: 0,
            SimAccess: 0,
            MaxAgents: 0,
            BillableFactor: 0,
            ObjectBonusFactor: 0,
            WaterHeight: 0,
            TerrainRaiseLimit: 0,
            TerrainLowerLimit: 0,
            PricePerMeter: 0,
            RedirectGridX: 0,
            RedirectGridY: 0,
            UseEstateSun: false,
            SunHour: 0
        };
        varLength = buf.readUInt8(pos++);
        newObjRegionInfo['SimName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjRegionInfo['EstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegionInfo['ParentEstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegionInfo['RegionFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegionInfo['SimAccess'] = buf.readUInt8(pos++);
        newObjRegionInfo['MaxAgents'] = buf.readUInt8(pos++);
        newObjRegionInfo['BillableFactor'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['ObjectBonusFactor'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['WaterHeight'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['TerrainRaiseLimit'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['TerrainLowerLimit'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['PricePerMeter'] = buf.readInt32LE(pos);
        pos += 4;
        newObjRegionInfo['RedirectGridX'] = buf.readInt32LE(pos);
        pos += 4;
        newObjRegionInfo['RedirectGridY'] = buf.readInt32LE(pos);
        pos += 4;
        newObjRegionInfo['UseEstateSun'] = (buf.readUInt8(pos++) === 1);
        newObjRegionInfo['SunHour'] = buf.readFloatLE(pos);
        pos += 4;
        this.RegionInfo = newObjRegionInfo;
        const newObjRegionInfo2 = {
            ProductSKU: Buffer.allocUnsafe(0),
            ProductName: Buffer.allocUnsafe(0),
            MaxAgents32: 0,
            HardMaxAgents: 0,
            HardMaxObjects: 0
        };
        varLength = buf.readUInt8(pos++);
        newObjRegionInfo2['ProductSKU'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjRegionInfo2['ProductName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjRegionInfo2['MaxAgents32'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegionInfo2['HardMaxAgents'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegionInfo2['HardMaxObjects'] = buf.readUInt32LE(pos);
        pos += 4;
        this.RegionInfo2 = newObjRegionInfo2;
        const count = buf.readUInt8(pos++);
        this.RegionInfo3 = [];
        for (let i = 0; i < count; i++) {
            const newObjRegionInfo3 = {
                RegionFlagsExtended: Long.ZERO
            };
            newObjRegionInfo3['RegionFlagsExtended'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            this.RegionInfo3.push(newObjRegionInfo3);
        }
        return pos - startPos;
    }
}
exports.RegionInfoMessage = RegionInfoMessage;
//# sourceMappingURL=RegionInfo.js.map