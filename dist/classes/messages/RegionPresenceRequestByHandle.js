"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RegionPresenceRequestByHandleMessage {
    constructor() {
        this.name = 'RegionPresenceRequestByHandle';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RegionPresenceRequestByHandle;
    }
    getSize() {
        return ((8) * this.RegionData.length) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = this.RegionData.length;
        buf.writeUInt8(this.RegionData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeInt32LE(this.RegionData[i]['RegionHandle'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.RegionData[i]['RegionHandle'].high, pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const count = buf.readUInt8(pos++);
        this.RegionData = [];
        for (let i = 0; i < count; i++) {
            const newObjRegionData = {
                RegionHandle: Long.ZERO
            };
            newObjRegionData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            this.RegionData.push(newObjRegionData);
        }
        return pos - startPos;
    }
}
exports.RegionPresenceRequestByHandleMessage = RegionPresenceRequestByHandleMessage;
//# sourceMappingURL=RegionPresenceRequestByHandle.js.map