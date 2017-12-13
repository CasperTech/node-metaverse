"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RequestInventoryAssetPacket {
    constructor() {
        this.name = 'RequestInventoryAsset';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902042;
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
exports.RequestInventoryAssetPacket = RequestInventoryAssetPacket;
//# sourceMappingURL=RequestInventoryAsset.js.map