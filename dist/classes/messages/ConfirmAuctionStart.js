"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ConfirmAuctionStartMessage {
    constructor() {
        this.name = 'ConfirmAuctionStart';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ConfirmAuctionStart;
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
        let varLength = 0;
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
exports.ConfirmAuctionStartMessage = ConfirmAuctionStartMessage;
//# sourceMappingURL=ConfirmAuctionStart.js.map