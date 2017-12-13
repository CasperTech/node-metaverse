"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ParcelObjectOwnersReplyPacket {
    constructor() {
        this.name = 'ParcelObjectOwnersReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901817;
    }
    getSize() {
        return ((22) * this.Data.length) + 1;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        const count = this.Data.length;
        buf.writeUInt8(this.Data.length, pos++);
        for (let i = 0; i < count; i++) {
            this.Data[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8((this.Data[i]['IsGroupOwned']) ? 1 : 0, pos++);
            buf.writeInt32LE(this.Data[i]['Count'], pos);
            pos += 4;
            buf.writeUInt8((this.Data[i]['OnlineStatus']) ? 1 : 0, pos++);
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const count = buf.readUInt8(pos++);
        this.Data = [];
        for (let i = 0; i < count; i++) {
            const newObjData = {
                OwnerID: UUID_1.UUID.zero(),
                IsGroupOwned: false,
                Count: 0,
                OnlineStatus: false
            };
            newObjData['OwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjData['IsGroupOwned'] = (buf.readUInt8(pos++) === 1);
            newObjData['Count'] = buf.readInt32LE(pos);
            pos += 4;
            newObjData['OnlineStatus'] = (buf.readUInt8(pos++) === 1);
            this.Data.push(newObjData);
        }
        return pos - startPos;
    }
}
exports.ParcelObjectOwnersReplyPacket = ParcelObjectOwnersReplyPacket;
//# sourceMappingURL=ParcelObjectOwnersReply.js.map