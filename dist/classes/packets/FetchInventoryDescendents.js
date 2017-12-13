"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class FetchInventoryDescendentsPacket {
    constructor() {
        this.name = 'FetchInventoryDescendents';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902037;
    }
    getSize() {
        return 70;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryData['FolderID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.InventoryData['SortOrder'], pos);
        pos += 4;
        buf.writeUInt8((this.InventoryData['FetchFolders']) ? 1 : 0, pos++);
        buf.writeUInt8((this.InventoryData['FetchItems']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjInventoryData = {
            FolderID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            SortOrder: 0,
            FetchFolders: false,
            FetchItems: false
        };
        newObjInventoryData['FolderID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['SortOrder'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInventoryData['FetchFolders'] = (buf.readUInt8(pos++) === 1);
        newObjInventoryData['FetchItems'] = (buf.readUInt8(pos++) === 1);
        this.InventoryData = newObjInventoryData;
        return pos - startPos;
    }
}
exports.FetchInventoryDescendentsPacket = FetchInventoryDescendentsPacket;
//# sourceMappingURL=FetchInventoryDescendents.js.map