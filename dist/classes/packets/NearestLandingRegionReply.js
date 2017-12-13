"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class NearestLandingRegionReplyPacket {
    constructor() {
        this.name = 'NearestLandingRegionReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901905;
    }
    getSize() {
        return 8;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.LandingRegionData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.LandingRegionData['RegionHandle'].high, pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjLandingRegionData = {
            RegionHandle: Long.ZERO
        };
        newObjLandingRegionData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        this.LandingRegionData = newObjLandingRegionData;
        return pos - startPos;
    }
}
exports.NearestLandingRegionReplyPacket = NearestLandingRegionReplyPacket;
//# sourceMappingURL=NearestLandingRegionReply.js.map