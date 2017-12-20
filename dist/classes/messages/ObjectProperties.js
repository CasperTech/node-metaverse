"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ObjectPropertiesMessage {
    constructor() {
        this.name = 'ObjectProperties';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = Message_1.Message.ObjectProperties;
    }
    getSize() {
        return this.calculateVarVarSize(this.ObjectData, 'Name', 1) + this.calculateVarVarSize(this.ObjectData, 'Description', 1) + this.calculateVarVarSize(this.ObjectData, 'TouchName', 1) + this.calculateVarVarSize(this.ObjectData, 'SitName', 1) + this.calculateVarVarSize(this.ObjectData, 'TextureID', 1) + ((174) * this.ObjectData.length) + 1;
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
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ObjectData[i]['ObjectID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ObjectData[i]['CreatorID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ObjectData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ObjectData[i]['GroupID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.ObjectData[i]['CreationDate'].low, pos);
            pos += 4;
            buf.writeInt32LE(this.ObjectData[i]['CreationDate'].high, pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['BaseMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['OwnerMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['GroupMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['EveryoneMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['NextOwnerMask'], pos);
            pos += 4;
            buf.writeInt32LE(this.ObjectData[i]['OwnershipCost'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['SaleType'], pos++);
            buf.writeInt32LE(this.ObjectData[i]['SalePrice'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['AggregatePerms'], pos++);
            buf.writeUInt8(this.ObjectData[i]['AggregatePermTextures'], pos++);
            buf.writeUInt8(this.ObjectData[i]['AggregatePermTexturesOwner'], pos++);
            buf.writeUInt32LE(this.ObjectData[i]['Category'], pos);
            pos += 4;
            buf.writeInt16LE(this.ObjectData[i]['InventorySerial'], pos);
            pos += 2;
            this.ObjectData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ObjectData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ObjectData[i]['FromTaskID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ObjectData[i]['LastOwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.ObjectData[i]['Name'].length, pos++);
            this.ObjectData[i]['Name'].copy(buf, pos);
            pos += this.ObjectData[i]['Name'].length;
            buf.writeUInt8(this.ObjectData[i]['Description'].length, pos++);
            this.ObjectData[i]['Description'].copy(buf, pos);
            pos += this.ObjectData[i]['Description'].length;
            buf.writeUInt8(this.ObjectData[i]['TouchName'].length, pos++);
            this.ObjectData[i]['TouchName'].copy(buf, pos);
            pos += this.ObjectData[i]['TouchName'].length;
            buf.writeUInt8(this.ObjectData[i]['SitName'].length, pos++);
            this.ObjectData[i]['SitName'].copy(buf, pos);
            pos += this.ObjectData[i]['SitName'].length;
            buf.writeUInt8(this.ObjectData[i]['TextureID'].length, pos++);
            this.ObjectData[i]['TextureID'].copy(buf, pos);
            pos += this.ObjectData[i]['TextureID'].length;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++) {
            const newObjObjectData = {
                ObjectID: UUID_1.UUID.zero(),
                CreatorID: UUID_1.UUID.zero(),
                OwnerID: UUID_1.UUID.zero(),
                GroupID: UUID_1.UUID.zero(),
                CreationDate: Long.ZERO,
                BaseMask: 0,
                OwnerMask: 0,
                GroupMask: 0,
                EveryoneMask: 0,
                NextOwnerMask: 0,
                OwnershipCost: 0,
                SaleType: 0,
                SalePrice: 0,
                AggregatePerms: 0,
                AggregatePermTextures: 0,
                AggregatePermTexturesOwner: 0,
                Category: 0,
                InventorySerial: 0,
                ItemID: UUID_1.UUID.zero(),
                FolderID: UUID_1.UUID.zero(),
                FromTaskID: UUID_1.UUID.zero(),
                LastOwnerID: UUID_1.UUID.zero(),
                Name: Buffer.allocUnsafe(0),
                Description: Buffer.allocUnsafe(0),
                TouchName: Buffer.allocUnsafe(0),
                SitName: Buffer.allocUnsafe(0),
                TextureID: Buffer.allocUnsafe(0)
            };
            newObjObjectData['ObjectID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjObjectData['CreatorID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjObjectData['OwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjObjectData['GroupID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjObjectData['CreationDate'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
            pos += 8;
            newObjObjectData['BaseMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['OwnerMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['GroupMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['EveryoneMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['NextOwnerMask'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['OwnershipCost'] = buf.readInt32LE(pos);
            pos += 4;
            newObjObjectData['SaleType'] = buf.readUInt8(pos++);
            newObjObjectData['SalePrice'] = buf.readInt32LE(pos);
            pos += 4;
            newObjObjectData['AggregatePerms'] = buf.readUInt8(pos++);
            newObjObjectData['AggregatePermTextures'] = buf.readUInt8(pos++);
            newObjObjectData['AggregatePermTexturesOwner'] = buf.readUInt8(pos++);
            newObjObjectData['Category'] = buf.readUInt32LE(pos);
            pos += 4;
            newObjObjectData['InventorySerial'] = buf.readInt16LE(pos);
            pos += 2;
            newObjObjectData['ItemID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjObjectData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjObjectData['FromTaskID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjObjectData['LastOwnerID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['Description'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['TouchName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['SitName'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            varLength = buf.readUInt8(pos++);
            newObjObjectData['TextureID'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.ObjectPropertiesMessage = ObjectPropertiesMessage;
//# sourceMappingURL=ObjectProperties.js.map