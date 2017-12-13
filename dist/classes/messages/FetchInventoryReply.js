"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class FetchInventoryReplyMessage {
    constructor() {
        this.name = 'FetchInventoryReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.FetchInventoryReply;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.InventoryData, 'Name', 1) + this.calculateVarVarSize(this.InventoryData, 'Description', 1) + 136) * this.InventoryData.length) + 17;
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
        const count = this.InventoryData.length;
        buf.writeUInt8(this.InventoryData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.InventoryData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            this.InventoryData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
            this.InventoryData[i]['CreatorID'].writeToBuffer(buf, pos);
            pos += 16;
            this.InventoryData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            this.InventoryData[i]['GroupID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt32LE(this.InventoryData[i]['BaseMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.InventoryData[i]['OwnerMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.InventoryData[i]['GroupMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.InventoryData[i]['EveryoneMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.InventoryData[i]['NextOwnerMask'], pos);
            pos += 4;
            buf.writeUInt8((this.InventoryData[i]['GroupOwned']) ? 1 : 0, pos++);
            this.InventoryData[i]['AssetID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt8(this.InventoryData[i]['Type'], pos++);
            buf.writeInt8(this.InventoryData[i]['InvType'], pos++);
            buf.writeUInt32LE(this.InventoryData[i]['Flags'], pos);
            pos += 4;
            buf.writeUInt8(this.InventoryData[i]['SaleType'], pos++);
            buf.writeInt32LE(this.InventoryData[i]['SalePrice'], pos);
            pos += 4;
            buf.writeUInt8(this.InventoryData[i]['Name'].length, pos++);
            this.InventoryData[i]['Name'].copy(buf, pos);
            pos += this.InventoryData[i]['Name'].length;
            buf.writeUInt8(this.InventoryData[i]['Description'].length, pos++);
            this.InventoryData[i]['Description'].copy(buf, pos);
            pos += this.InventoryData[i]['Description'].length;
            buf.writeInt32LE(this.InventoryData[i]['CreationDate'], pos);
            pos += 4;
            buf.writeUInt32LE(this.InventoryData[i]['CRC'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.InventoryData = [];
        for (let i = 0; i < count; i++) {
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
                Name: Buffer.allocUnsafe(0),
                Description: Buffer.allocUnsafe(0),
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
            varLength = buf.readUInt8(pos++);
            newObjInventoryData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjInventoryData['Description'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            newObjInventoryData['CreationDate'] = buf.readInt32LE(pos);
            pos += 4;
            newObjInventoryData['CRC'] = buf.readUInt32LE(pos);
            pos += 4;
            this.InventoryData.push(newObjInventoryData);
        }
        return pos - startPos;
    }
}
exports.FetchInventoryReplyMessage = FetchInventoryReplyMessage;
//# sourceMappingURL=FetchInventoryReply.js.map