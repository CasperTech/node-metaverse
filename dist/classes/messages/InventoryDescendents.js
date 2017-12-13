"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class InventoryDescendentsMessage {
    constructor() {
        this.name = 'InventoryDescendents';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.InventoryDescendents;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.FolderData, 'Name', 1) + 33) * this.FolderData.length) + ((this.calculateVarVarSize(this.ItemData, 'Name', 1) + this.calculateVarVarSize(this.ItemData, 'Description', 1) + 136) * this.ItemData.length) + 58;
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
        this.AgentData['FolderID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.AgentData['Version'], pos);
        pos += 4;
        buf.writeInt32LE(this.AgentData['Descendents'], pos);
        pos += 4;
        let count = this.FolderData.length;
        buf.writeUInt8(this.FolderData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.FolderData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
            this.FolderData[i]['ParentID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt8(this.FolderData[i]['Type'], pos++);
            buf.writeUInt8(this.FolderData[i]['Name'].length, pos++);
            this.FolderData[i]['Name'].copy(buf, pos);
            pos += this.FolderData[i]['Name'].length;
        }
        count = this.ItemData.length;
        buf.writeUInt8(this.ItemData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ItemData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ItemData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ItemData[i]['CreatorID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ItemData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ItemData[i]['GroupID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt32LE(this.ItemData[i]['BaseMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ItemData[i]['OwnerMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ItemData[i]['GroupMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ItemData[i]['EveryoneMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ItemData[i]['NextOwnerMask'], pos);
            pos += 4;
            buf.writeUInt8((this.ItemData[i]['GroupOwned']) ? 1 : 0, pos++);
            this.ItemData[i]['AssetID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt8(this.ItemData[i]['Type'], pos++);
            buf.writeInt8(this.ItemData[i]['InvType'], pos++);
            buf.writeUInt32LE(this.ItemData[i]['Flags'], pos);
            pos += 4;
            buf.writeUInt8(this.ItemData[i]['SaleType'], pos++);
            buf.writeInt32LE(this.ItemData[i]['SalePrice'], pos);
            pos += 4;
            buf.writeUInt8(this.ItemData[i]['Name'].length, pos++);
            this.ItemData[i]['Name'].copy(buf, pos);
            pos += this.ItemData[i]['Name'].length;
            buf.writeUInt8(this.ItemData[i]['Description'].length, pos++);
            this.ItemData[i]['Description'].copy(buf, pos);
            pos += this.ItemData[i]['Description'].length;
            buf.writeInt32LE(this.ItemData[i]['CreationDate'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ItemData[i]['CRC'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            FolderID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            Version: 0,
            Descendents: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['FolderID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['Version'] = buf.readInt32LE(pos);
        pos += 4;
        newObjAgentData['Descendents'] = buf.readInt32LE(pos);
        pos += 4;
        this.AgentData = newObjAgentData;
        let count = buf.readUInt8(pos++);
        this.FolderData = [];
        for (let i = 0; i < count; i++) {
            const newObjFolderData = {
                FolderID: UUID_1.UUID.zero(),
                ParentID: UUID_1.UUID.zero(),
                Type: 0,
                Name: Buffer.allocUnsafe(0)
            };
            newObjFolderData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjFolderData['ParentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjFolderData['Type'] = buf.readInt8(pos++);
            varLength = buf.readUInt8(pos++);
            newObjFolderData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.FolderData.push(newObjFolderData);
        }
        count = buf.readUInt8(pos++);
        this.ItemData = [];
        for (let i = 0; i < count; i++) {
            const newObjItemData = {
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
                Name: Buffer.allocUnsafe(0),
                Description: Buffer.allocUnsafe(0),
                CreationDate: 0,
                CRC: 0
            };
            newObjItemData['ItemID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['CreatorID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['OwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['GroupID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['BaseMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['OwnerMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['GroupMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['EveryoneMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['NextOwnerMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['GroupOwned'] = (buf.readUInt8(pos++) === 1);
            newObjItemData['AssetID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjItemData['Type'] = buf.readInt8(pos++);
            newObjItemData['InvType'] = buf.readInt8(pos++);
            newObjItemData['Flags'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjItemData['SaleType'] = buf.readUInt8(pos++);
            newObjItemData['SalePrice'] = buf.readInt32LE(pos);
            pos += 4;
            varLength = buf.readUInt8(pos++);
            newObjItemData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjItemData['Description'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjItemData['CreationDate'] = buf.readInt32LE(pos);
            pos += 4;
            newObjItemData['CRC'] = buf.readUInt32LE(pos);
            pos += 4;
            this.ItemData.push(newObjItemData);
        }
        return pos - startPos;
    }
}
exports.InventoryDescendentsMessage = InventoryDescendentsMessage;
//# sourceMappingURL=InventoryDescendents.js.map