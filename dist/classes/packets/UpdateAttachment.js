"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class UpdateAttachmentPacket {
    constructor() {
        this.name = 'UpdateAttachment';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902091;
    }
    getSize() {
        return (this.InventoryData['Name'].length + 1 + this.InventoryData['Description'].length + 1) + 171;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.AttachmentBlock['AttachmentPoint'], pos++);
        buf.writeUInt8((this.OperationData['AddItem']) ? 1 : 0, pos++);
        buf.writeUInt8((this.OperationData['UseExistingAsset']) ? 1 : 0, pos++);
        this.InventoryData['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryData['FolderID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryData['CreatorID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.InventoryData['BaseMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryData['OwnerMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryData['GroupMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryData['EveryoneMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryData['NextOwnerMask'], pos);
        pos += 4;
        buf.writeUInt8((this.InventoryData['GroupOwned']) ? 1 : 0, pos++);
        this.InventoryData['AssetID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt8(this.InventoryData['Type'], pos++);
        buf.writeInt8(this.InventoryData['InvType'], pos++);
        buf.writeUInt32LE(this.InventoryData['Flags'], pos);
        pos += 4;
        buf.writeUInt8(this.InventoryData['SaleType'], pos++);
        buf.writeInt32LE(this.InventoryData['SalePrice'], pos);
        pos += 4;
        buf.write(this.InventoryData['Name'], pos);
        pos += this.InventoryData['Name'].length;
        buf.write(this.InventoryData['Description'], pos);
        pos += this.InventoryData['Description'].length;
        buf.writeInt32LE(this.InventoryData['CreationDate'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryData['CRC'], pos);
        pos += 4;
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
        const newObjAttachmentBlock = {
            AttachmentPoint: 0
        };
        newObjAttachmentBlock['AttachmentPoint'] = buf.readUInt8(pos++);
        this.AttachmentBlock = newObjAttachmentBlock;
        const newObjOperationData = {
            AddItem: false,
            UseExistingAsset: false
        };
        newObjOperationData['AddItem'] = (buf.readUInt8(pos++) === 1);
        newObjOperationData['UseExistingAsset'] = (buf.readUInt8(pos++) === 1);
        this.OperationData = newObjOperationData;
        const newObjInventoryData = {
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
            AssetID: UUID_1.UUID.zero(),
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
        newObjInventoryData['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['FolderID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['CreatorID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['BaseMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryData['OwnerMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryData['GroupMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryData['EveryoneMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryData['NextOwnerMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryData['GroupOwned'] = (buf.readUInt8(pos++) === 1);
        newObjInventoryData['AssetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryData['Type'] = buf.readInt8(pos++);
        newObjInventoryData['InvType'] = buf.readInt8(pos++);
        newObjInventoryData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryData['SaleType'] = buf.readUInt8(pos++);
        newObjInventoryData['SalePrice'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInventoryData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjInventoryData['Description'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjInventoryData['CreationDate'] = buf.readInt32LE(pos);
        pos += 4;
        newObjInventoryData['CRC'] = buf.readUInt32LE(pos);
        pos += 4;
        this.InventoryData = newObjInventoryData;
        return pos - startPos;
    }
}
exports.UpdateAttachmentPacket = UpdateAttachmentPacket;
//# sourceMappingURL=UpdateAttachment.js.map