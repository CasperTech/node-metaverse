"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const IPAddress_1 = require("../IPAddress");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RegionPresenceResponseMessage {
    constructor() {
        this.name = 'RegionPresenceResponse';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RegionPresenceResponse;
    }
    getSize() {
        return this.calculateVarVarSize(this.RegionData, 'Message', 1) + ((42) * this.RegionData.length) + 1;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = this.RegionData.length;
        buf.writeUInt8(this.RegionData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.RegionData[i]['RegionID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.RegionData[i]['RegionHandle'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.RegionData[i]['RegionHandle'].high, pos);
            pos += 4;
            this.RegionData[i]['InternalRegionIP'].writeToBuffer(buf, pos);
            pos += 4;
            this.RegionData[i]['ExternalRegionIP'].writeToBuffer(buf, pos);
            pos += 4;
            buf.writeUInt16LE(this.RegionData[i]['RegionPort'], pos);
            pos += 2;
            buf.writeDoubleLE(this.RegionData[i]['ValidUntil'], pos);
            pos += 8;
            buf.writeUInt8(this.RegionData[i]['Message'].length, pos++);
            this.RegionData[i]['Message'].copy(buf, pos);
            pos += this.RegionData[i]['Message'].length;
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
                RegionID: UUID_1.UUID.zero(),
                RegionHandle: Long.ZERO,
                InternalRegionIP: IPAddress_1.IPAddress.zero(),
                ExternalRegionIP: IPAddress_1.IPAddress.zero(),
                RegionPort: 0,
                ValidUntil: 0,
                Message: Buffer.allocUnsafe(0)
            };
            newObjRegionData['RegionID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjRegionData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjRegionData['InternalRegionIP'] = new IPAddress_1.IPAddress(buf, pos);
            pos += 4;
            newObjRegionData['ExternalRegionIP'] = new IPAddress_1.IPAddress(buf, pos);
            pos += 4;
            newObjRegionData['RegionPort'] = buf.readUInt16LE(pos);
            pos += 2;
            newObjRegionData['ValidUntil'] = buf.readDoubleLE(pos);
            pos += 8;
            varLength = buf.readUInt8(pos++);
            newObjRegionData['Message'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.RegionData.push(newObjRegionData);
        }
        return pos - startPos;
    }
}
exports.RegionPresenceResponseMessage = RegionPresenceResponseMessage;
//# sourceMappingURL=RegionPresenceResponse.js.map