"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MoveInventoryItemPacket {
    constructor() {
        this.name = 'MoveInventoryItem';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902028;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.InventoryData, 'NewName', 1) + 32) * this.InventoryData.length) + 34;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
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
            this.InventoryData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            this.InventoryData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.write(this.InventoryData[i]['NewName'], pos);
            pos += this.InventoryData[i]['NewName'].length;
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
                ItemID: UUID_1.UUID.zero(),
                FolderID: UUID_1.UUID.zero(),
                NewName: ''
            };
            newObjInventoryData['ItemID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjInventoryData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjInventoryData['NewName'] = buf.toString('utf8', pos, length);
            pos += length;
            this.InventoryData.push(newObjInventoryData);
        }
        return pos - startPos;
    }
}
exports.MoveInventoryItemPacket = MoveInventoryItemPacket;
//# sourceMappingURL=MoveInventoryItem.js.map