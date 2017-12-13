"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RezScriptPacket {
    constructor() {
        this.name = 'RezScript';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902064;
    }
    getSize() {
        return (this.InventoryBlock['Name'].length + 1 + this.InventoryBlock['Description'].length + 1) + 189;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.UpdateBlock['ObjectLocalID'], pos);
        pos += 4;
        buf.writeUInt8((this.UpdateBlock['Enabled']) ? 1 : 0, pos++);
        this.InventoryBlock['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryBlock['FolderID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryBlock['CreatorID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryBlock['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryBlock['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.InventoryBlock['BaseMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryBlock['OwnerMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryBlock['GroupMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryBlock['EveryoneMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryBlock['NextOwnerMask'], pos);
        pos += 4;
        buf.writeUInt8((this.InventoryBlock['GroupOwned']) ? 1 : 0, pos++);
        this.InventoryBlock['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt8(this.InventoryBlock['Type'], pos++);
        buf.writeInt8(this.InventoryBlock['InvType'], pos++);
        buf.writeUInt32LE(this.InventoryBlock['Flags'], pos);
        pos += 4;
        buf.writeUInt8(this.InventoryBlock['SaleType'], pos++);
        buf.writeInt32LE(this.InventoryBlock['SalePrice'], pos);
        pos += 4;
        buf.write(this.InventoryBlock['Name'], pos);
        pos += this.InventoryBlock['Name'].length;
        buf.write(this.InventoryBlock['Description'], pos);
        pos += this.InventoryBlock['Description'].length;
        buf.writeInt32LE(this.InventoryBlock['CreationDate'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryBlock['CRC'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjUpdateBlock = {
            ObjectLocalID: 0,
            Enabled: false
        };
        newObjUpdateBlock['ObjectLocalID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjUpdateBlock['Enabled'] = (buf.readUInt8(pos++) === 1);
        this.UpdateBlock = newObjUpdateBlock;
        const newObjInventoryBlock = {
            ItemID: UUID_1.UUID.zero(),
            FolderID: UUID_1.UUID.zero(),
            CreatorID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero(),
            BaseMask: 0,
            OwnerMask: 0,
            GroupMask: 0,
            EveryoneMask: 0,
            NextOwnerMask: 0,
            GroupOwned: false,
            TransactionID: UUID_1.UUID.zero(),
            Type: 0,
            InvType: 0,
            Flags: 0,
            SaleType: 0,
            SalePrice: 0,
            Name: '',
            Description: '',
            CreationDate: 0,
            CRC: 0
        };
        newObjInventoryBlock['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryBlock['FolderID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryBlock['CreatorID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryBlock['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryBlock['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryBlock['BaseMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryBlock['OwnerMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryBlock['GroupMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryBlock['EveryoneMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryBlock['NextOwnerMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryBlock['GroupOwned'] = (buf.readUInt8(pos++) === 1);
        newObjInventoryBlock['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryBlock['Type'] = buf.readInt8(pos++);
        newObjInventoryBlock['InvType'] = buf.readInt8(pos++);
        newObjInventoryBlock['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryBlock['SaleType'] = buf.readUInt8(pos++);
        newObjInventoryBlock['SalePrice'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInventoryBlock['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjInventoryBlock['Description'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjInventoryBlock['CreationDate'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInventoryBlock['CRC'] = buf.readUInt32LE(pos);
        pos += 4;
        this.InventoryBlock = newObjInventoryBlock;
        return pos - startPos;
    }
}
exports.RezScriptPacket = RezScriptPacket;
//# sourceMappingURL=RezScript.js.map