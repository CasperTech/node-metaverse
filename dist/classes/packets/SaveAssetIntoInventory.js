"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class SaveAssetIntoInventoryPacket {
    constructor() {
        this.name = 'SaveAssetIntoInventory';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902032;
    }
    getSize() {
        return 48;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryData['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryData['NewAssetID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjInventoryData = {
            ItemID: UUID_1.UUID.zero(),
            NewAssetID: UUID_1.UUID.zero()
        };
        newObjInventoryData['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['NewAssetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.InventoryData = newObjInventoryData;
        return pos - startPos;
    }
}
exports.SaveAssetIntoInventoryPacket = SaveAssetIntoInventoryPacket;
//# sourceMappingURL=SaveAssetIntoInventory.js.map