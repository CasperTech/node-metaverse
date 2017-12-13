"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MoveTaskInventoryPacket {
    constructor() {
        this.name = 'MoveTaskInventory';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902048;
    }
    getSize() {
        return 68;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['FolderID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.InventoryData['LocalID'], pos);
        pos += 4;
        this.InventoryData['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            FolderID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['FolderID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjInventoryData = {
            LocalID: 0,
            ItemID: UUID_1.UUID.zero()
        };
        newObjInventoryData['LocalID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryData['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.InventoryData = newObjInventoryData;
        return pos - startPos;
    }
}
exports.MoveTaskInventoryPacket = MoveTaskInventoryPacket;
//# sourceMappingURL=MoveTaskInventory.js.map