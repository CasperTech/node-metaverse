"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class TeleportLandingStatusChangedMessage {
    constructor() {
        this.name = 'TeleportLandingStatusChanged';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.TeleportLandingStatusChanged;
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
        let varLength = 0;
        const newObjRegionData = {
            RegionHandle: Long.ZERO
        };
        newObjRegionData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        this.RegionData = newObjRegionData;
        return pos - startPos;
    }
}
exports.TeleportLandingStatusChangedMessage = TeleportLandingStatusChangedMessage;
//# sourceMappingURL=TeleportLandingStatusChanged.js.map