"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SimStatsPacket {
    constructor() {
        this.name = 'SimStats';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901900;
    }
    getSize() {
        return ((8) * this.Stat.length) + ((8) * this.RegionInfo.length) + 22;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.Region['RegionX'], pos);
        pos += 4;
        buf.writeUInt32LE(this.Region['RegionY'], pos);
        pos += 4;
        buf.writeUInt32LE(this.Region['RegionFlags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.Region['ObjectCapacity'], pos);
        pos += 4;
        let count = this.Stat.length;
        buf.writeUInt8(this.Stat.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.Stat[i]['StatID'], pos);
            pos += 4;
            buf.writeFloatLE(this.Stat[i]['StatValue'], pos);
            pos += 4;
        }
        buf.writeInt32LE(this.PidStat['PID'], pos);
        pos += 4;
        count = this.RegionInfo.length;
        buf.writeUInt8(this.RegionInfo.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeInt32LE(this.RegionInfo[i]['RegionFlagsExtended'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.RegionInfo[i]['RegionFlagsExtended'].high, pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjRegion = {
            RegionX: 0,
            RegionY: 0,
            RegionFlags: 0,
            ObjectCapacity: 0
        };
        newObjRegion['RegionX'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegion['RegionY'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegion['RegionFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRegion['ObjectCapacity'] = buf.readUInt32LE(pos);
        pos += 4;
        this.Region = newObjRegion;
        let count = buf.readUInt8(pos++);
        this.Stat = [];
        for (let i = 0; i < count; i++) {
            const newObjStat = {
                StatID: 0,
                StatValue: 0
            };
            newObjStat['StatID'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjStat['StatValue'] = buf.readFloatLE(pos);
            pos += 4;
            this.Stat.push(newObjStat);
        }
        const newObjPidStat = {
            PID: 0
        };
        newObjPidStat['PID'] = buf.readInt32LE(pos);
        pos += 4;
        this.PidStat = newObjPidStat;
        count = buf.readUInt8(pos++);
        this.RegionInfo = [];
        for (let i = 0; i < count; i++) {
            const newObjRegionInfo = {
                RegionFlagsExtended: Long.ZERO
            };
            newObjRegionInfo['RegionFlagsExtended'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            this.RegionInfo.push(newObjRegionInfo);
        }
        return pos - startPos;
    }
}
exports.SimStatsPacket = SimStatsPacket;
//# sourceMappingURL=SimStats.js.map