"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class NearestLandingRegionRequestPacket {
    constructor() {
        this.name = 'NearestLandingRegionRequest';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901904;
    }
    getSize() {
        return 8;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.RequestingRegionData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.RequestingRegionData['RegionHandle'].high, pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjRequestingRegionData = {
            RegionHandle: Long.ZERO
        };
        newObjRequestingRegionData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        this.RequestingRegionData = newObjRequestingRegionData;
        return pos - startPos;
    }
}
exports.NearestLandingRegionRequestPacket = NearestLandingRegionRequestPacket;
//# sourceMappingURL=NearestLandingRegionRequest.js.map