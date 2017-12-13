"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RegionPresenceRequestByRegionIDMessage {
    constructor() {
        this.name = 'RegionPresenceRequestByRegionID';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RegionPresenceRequestByRegionID;
    }
    getSize() {
        return ((16) * this.RegionData.length) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = this.RegionData.length;
        buf.writeUInt8(this.RegionData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.RegionData[i]['RegionID'].writeToBuffer(buf, pos);
            pos += 16;
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
                RegionID: UUID_1.UUID.zero()
            };
            newObjRegionData['RegionID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.RegionData.push(newObjRegionData);
        }
        return pos - startPos;
    }
}
exports.RegionPresenceRequestByRegionIDMessage = RegionPresenceRequestByRegionIDMessage;
//# sourceMappingURL=RegionPresenceRequestByRegionID.js.map