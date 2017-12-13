"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RegionHandshakePacket {
    constructor() {
        this.name = 'RegionHandshake';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901908;
    }
    getSize() {
        return (this.RegionInfo['SimName'].length + 1) + (this.RegionInfo3['ColoName'].length + 1 + this.RegionInfo3['ProductSKU'].length + 1 + this.RegionInfo3['ProductName'].length + 1) + ((16) * this.RegionInfo4.length) + 231;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.RegionInfo['RegionFlags'], pos);
        pos += 4;
        buf.writeUInt8(this.RegionInfo['SimAccess'], pos++);
        buf.write(this.RegionInfo['SimName'], pos);
        pos += this.RegionInfo['SimName'].length;
        this.RegionInfo['SimOwner'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.RegionInfo['IsEstateManager']) ? 1 : 0, pos++);
        buf.writeFloatLE(this.RegionInfo['WaterHeight'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['BillableFactor'], pos);
        pos += 4;
        this.RegionInfo['CacheID'].writeToBuffer(buf, pos);
        pos += 16;
        this.RegionInfo['TerrainBase0'].writeToBuffer(buf, pos);
        pos += 16;
        this.RegionInfo['TerrainBase1'].writeToBuffer(buf, pos);
        pos += 16;
        this.RegionInfo['TerrainBase2'].writeToBuffer(buf, pos);
        pos += 16;
        this.RegionInfo['TerrainBase3'].writeToBuffer(buf, pos);
        pos += 16;
        this.RegionInfo['TerrainDetail0'].writeToBuffer(buf, pos);
        pos += 16;
        this.RegionInfo['TerrainDetail1'].writeToBuffer(buf, pos);
        pos += 16;
        this.RegionInfo['TerrainDetail2'].writeToBuffer(buf, pos);
        pos += 16;
        this.RegionInfo['TerrainDetail3'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeFloatLE(this.RegionInfo['TerrainStartHeight00'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['TerrainStartHeight01'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['TerrainStartHeight10'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['TerrainStartHeight11'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['TerrainHeightRange00'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['TerrainHeightRange01'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['TerrainHeightRange10'], pos);
        pos += 4;
        buf.writeFloatLE(this.RegionInfo['TerrainHeightRange11'], pos);
        pos += 4;
        this.RegionInfo2['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.RegionInfo3['CPUClassID'], pos);
        pos += 4;
        buf.writeInt32LE(this.RegionInfo3['CPURatio'], pos);
        pos += 4;
        buf.write(this.RegionInfo3['ColoName'], pos);
        pos += this.RegionInfo3['ColoName'].length;
        buf.write(this.RegionInfo3['ProductSKU'], pos);
        pos += this.RegionInfo3['ProductSKU'].length;
        buf.write(this.RegionInfo3['ProductName'], pos);
        pos += this.RegionInfo3['ProductName'].length;
        const count = this.RegionInfo4.length;
        buf.writeUInt8(this.RegionInfo4.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeInt32LE(this.RegionInfo4[i]['RegionFlagsExtended'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.RegionInfo4[i]['RegionFlagsExtended'].high, pos);
            pos += 4;
            buf.writeInt32LE(this.RegionInfo4[i]['RegionProtocols'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.RegionInfo4[i]['RegionProtocols'].high, pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjRegionInfo = {
            RegionFlags: 0,
            SimAccess: 0,
            SimName: '',
            SimOwner: UUID_1.UUID.zero(),
            IsEstateManager: false,
            WaterHeight: 0,
            BillableFactor: 0,
            CacheID: UUID_1.UUID.zero(),
            TerrainBase0: UUID_1.UUID.zero(),
            TerrainBase1: UUID_1.UUID.zero(),
            TerrainBase2: UUID_1.UUID.zero(),
            TerrainBase3: UUID_1.UUID.zero(),
            TerrainDetail0: UUID_1.UUID.zero(),
            TerrainDetail1: UUID_1.UUID.zero(),
            TerrainDetail2: UUID_1.UUID.zero(),
            TerrainDetail3: UUID_1.UUID.zero(),
            TerrainStartHeight00: 0,
            TerrainStartHeight01: 0,
            TerrainStartHeight10: 0,
            TerrainStartHeight11: 0,
            TerrainHeightRange00: 0,
            TerrainHeightRange01: 0,
            TerrainHeightRange10: 0,
            TerrainHeightRange11: 0
        };
        newObjRegionInfo['RegionFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegionInfo['SimAccess'] = buf.readUInt8(pos++);
        newObjRegionInfo['SimName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjRegionInfo['SimOwner'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionInfo['IsEstateManager'] = (buf.readUInt8(pos++) === 1);
        newObjRegionInfo['WaterHeight'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['BillableFactor'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['CacheID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionInfo['TerrainBase0'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionInfo['TerrainBase1'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionInfo['TerrainBase2'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionInfo['TerrainBase3'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionInfo['TerrainDetail0'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionInfo['TerrainDetail1'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionInfo['TerrainDetail2'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionInfo['TerrainDetail3'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRegionInfo['TerrainStartHeight00'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['TerrainStartHeight01'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['TerrainStartHeight10'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['TerrainStartHeight11'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['TerrainHeightRange00'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['TerrainHeightRange01'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['TerrainHeightRange10'] = buf.readFloatLE(pos);
        pos += 4;
        newObjRegionInfo['TerrainHeightRange11'] = buf.readFloatLE(pos);
        pos += 4;
        this.RegionInfo = newObjRegionInfo;
        const newObjRegionInfo2 = {
            RegionID: UUID_1.UUID.zero()
        };
        newObjRegionInfo2['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.RegionInfo2 = newObjRegionInfo2;
        const newObjRegionInfo3 = {
            CPUClassID: 0,
            CPURatio: 0,
            ColoName: '',
            ProductSKU: '',
            ProductName: ''
        };
        newObjRegionInfo3['CPUClassID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjRegionInfo3['CPURatio'] = buf.readInt32LE(pos);
        pos += 4;
        newObjRegionInfo3['ColoName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjRegionInfo3['ProductSKU'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjRegionInfo3['ProductName'] = buf.toString('utf8', pos, length);
        pos += length;
        this.RegionInfo3 = newObjRegionInfo3;
        const count = buf.readUInt8(pos++);
        this.RegionInfo4 = [];
        for (let i = 0; i < count; i++) {
            const newObjRegionInfo4 = {
                RegionFlagsExtended: Long.ZERO,
                RegionProtocols: Long.ZERO
            };
            newObjRegionInfo4['RegionFlagsExtended'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjRegionInfo4['RegionProtocols'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            this.RegionInfo4.push(newObjRegionInfo4);
        }
        return pos - startPos;
    }
}
exports.RegionHandshakePacket = RegionHandshakePacket;
//# sourceMappingURL=RegionHandshake.js.map