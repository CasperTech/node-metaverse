"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MoveInventoryFolderPacket {
    constructor() {
        this.name = 'MoveInventoryFolder';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902035;
    }
    getSize() {
        return ((32) * this.InventoryData.length) + 34;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.AgentData['Stamp']) ? 1 : 0, pos++);
        const count = this.InventoryData.length;
        buf.writeUInt8(this.InventoryData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.InventoryData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
            this.InventoryData[i]['ParentID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            Stamp: false
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['Stamp'] = (buf.readUInt8(pos++) === 1);
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.InventoryData = [];
        for (let i = 0; i < count; i++) {
            const newObjInventoryData = {
                FolderID: UUID_1.UUID.zero(),
                ParentID: UUID_1.UUID.zero()
            };
            newObjInventoryData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjInventoryData['ParentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.InventoryData.push(newObjInventoryData);
        }
        return pos - startPos;
    }
}
exports.MoveInventoryFolderPacket = MoveInventoryFolderPacket;
//# sourceMappingURL=MoveInventoryFolder.js.map