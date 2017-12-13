"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RequestInventoryAssetMessage {
    constructor() {
        this.name = 'RequestInventoryAsset';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RequestInventoryAsset;
    }
    getSize() {
        return 64;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.QueryData['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
        this.QueryData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.QueryData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        this.QueryData['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjQueryData = {
            QueryID: UUID_1.UUID.zero(),
            AgentID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            ItemID: UUID_1.UUID.zero()
        };
        newObjQueryData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjQueryData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjQueryData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjQueryData['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.QueryData = newObjQueryData;
        return pos - startPos;
    }
}
exports.RequestInventoryAssetMessage = RequestInventoryAssetMessage;
//# sourceMappingURL=RequestInventoryAsset.js.map