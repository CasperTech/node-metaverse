"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class CopyInventoryFromNotecardPacket {
    constructor() {
        this.name = 'CopyInventoryFromNotecard';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.Deprecated | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902025;
    }
    getSize() {
        return ((32) * this.InventoryData.length) + 65;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.NotecardData['NotecardItemID'].writeToBuffer(buf, pos);
        pos += 16;
        this.NotecardData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.InventoryData.length;
        buf.writeUInt8(this.InventoryData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.InventoryData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            this.InventoryData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
        }
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
        const newObjNotecardData = {
            NotecardItemID: UUID_1.UUID.zero(),
            ObjectID: UUID_1.UUID.zero()
        };
        newObjNotecardData['NotecardItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjNotecardData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.NotecardData = newObjNotecardData;
        const count = buf.readUInt8(pos++);
        this.InventoryData = [];
        for (let i = 0; i < count; i++) {
            const newObjInventoryData = {
                ItemID: UUID_1.UUID.zero(),
                FolderID: UUID_1.UUID.zero()
            };
            newObjInventoryData['ItemID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjInventoryData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.InventoryData.push(newObjInventoryData);
        }
        return pos - startPos;
    }
}
exports.CopyInventoryFromNotecardPacket = CopyInventoryFromNotecardPacket;
//# sourceMappingURL=CopyInventoryFromNotecard.js.map