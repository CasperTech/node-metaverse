"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ConfirmAuctionStartPacket {
    constructor() {
        this.name = 'ConfirmAuctionStart';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901990;
    }
    getSize() {
        return 20;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AuctionData['ParcelID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AuctionData['AuctionID'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAuctionData = {
            ParcelID: UUID_1.UUID.zero(),
            AuctionID: 0
        };
        newObjAuctionData['ParcelID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAuctionData['AuctionID'] = buf.readUInt32LE(pos);
        pos += 4;
        this.AuctionData = newObjAuctionData;
        return pos - startPos;
    }
}
exports.ConfirmAuctionStartPacket = ConfirmAuctionStartPacket;
//# sourceMappingURL=ConfirmAuctionStart.js.map