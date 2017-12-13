"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class InventoryAssetResponseMessage {
    constructor() {
        this.name = 'InventoryAssetResponse';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.InventoryAssetResponse;
    }
    getSize() {
        return 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.QueryData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        this.QueryData['AssetID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.QueryData['IsReadable']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjQueryData = {
            QueryID: UUID_1.UUID.zero(),
            AssetID: UUID_1.UUID.zero(),
            IsReadable: false
        };
        newObjQueryData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjQueryData['AssetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjQueryData['IsReadable'] = (buf.readUInt8(pos++) === 1);
        this.QueryData = newObjQueryData;
        return pos - startPos;
    }
}
exports.InventoryAssetResponseMessage = InventoryAssetResponseMessage;
//# sourceMappingURL=InventoryAssetResponse.js.map