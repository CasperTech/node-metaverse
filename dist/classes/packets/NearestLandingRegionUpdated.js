"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class NearestLandingRegionUpdatedPacket {
    constructor() {
        this.name = 'NearestLandingRegionUpdated';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901906;
    }
    getSize() {
        return 8;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.RegionData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.RegionData['RegionHandle'].high, pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjRegionData = {
            RegionHandle: Long.ZERO
        };
        newObjRegionData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        this.RegionData = newObjRegionData;
        return pos - startPos;
    }
}
exports.NearestLandingRegionUpdatedPacket = NearestLandingRegionUpdatedPacket;
//# sourceMappingURL=NearestLandingRegionUpdated.js.map