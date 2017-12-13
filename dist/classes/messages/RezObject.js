"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RezObjectMessage {
    constructor() {
        this.name = 'RezObject';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RezObject;
    }
    getSize() {
        return (this.InventoryData['Name'].length + 1 + this.InventoryData['Description'].length + 1) + 260;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        this.RezData['FromTaskID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.RezData['BypassRaycast'], pos++);
        this.RezData['RayStart'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.RezData['RayEnd'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.RezData['RayTargetID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.RezData['RayEndIsIntersection']) ? 1 : 0, pos++);
        buf.writeUInt8((this.RezData['RezSelected']) ? 1 : 0, pos++);
        buf.writeUInt8((this.RezData['RemoveItem']) ? 1 : 0, pos++);
        buf.writeUInt32LE(this.RezData['ItemFlags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RezData['GroupMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RezData['EveryoneMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RezData['NextOwnerMask'], pos);
        pos += 4;
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
        this.InventoryData['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt8(this.InventoryData['Type'], pos++);
        buf.writeInt8(this.InventoryData['InvType'], pos++);
        buf.writeUInt32LE(this.InventoryData['Flags'], pos);
        pos += 4;
        buf.writeUInt8(this.InventoryData['SaleType'], pos++);
        buf.writeInt32LE(this.InventoryData['SalePrice'], pos);
        pos += 4;
        buf.writeUInt8(this.InventoryData['Name'].length, pos++);
        this.InventoryData['Name'].copy(buf, pos);
        pos += this.InventoryData['Name'].length;
        buf.writeUInt8(this.InventoryData['Description'].length, pos++);
        this.InventoryData['Description'].copy(buf, pos);
        pos += this.InventoryData['Description'].length;
        buf.writeInt32LE(this.InventoryData['CreationDate'], pos);
        pos += 4;
        buf.writeUInt32LE(this.InventoryData['CRC'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
        const newObjRezData = {
            FromTaskID: UUID_1.UUID.zero(),
            BypassRaycast: 0,
            RayStart: Vector3_1.Vector3.getZero(),
            RayEnd: Vector3_1.Vector3.getZero(),
            RayTargetID: UUID_1.UUID.zero(),
            RayEndIsIntersection: false,
            RezSelected: false,
            RemoveItem: false,
            ItemFlags: 0,
            GroupMask: 0,
            EveryoneMask: 0,
            NextOwnerMask: 0
        };
        newObjRezData['FromTaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRezData['BypassRaycast'] = buf.readUInt8(pos++);
        newObjRezData['RayStart'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjRezData['RayEnd'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjRezData['RayTargetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRezData['RayEndIsIntersection'] = (buf.readUInt8(pos++) === 1);
        newObjRezData['RezSelected'] = (buf.readUInt8(pos++) === 1);
        newObjRezData['RemoveItem'] = (buf.readUInt8(pos++) === 1);
        newObjRezData['ItemFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRezData['GroupMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRezData['EveryoneMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRezData['NextOwnerMask'] = buf.readUInt32LE(pos);
        pos += 4;
        this.RezData = newObjRezData;
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
            TransactionID: UUID_1.UUID.zero(),
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
        newObjInventoryData['TransactionID'] = new UUID_1.UUID(buf, pos);
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
        this.InventoryData = newObjInventoryData;
        return pos - startPos;
    }
}
exports.RezObjectMessage = RezObjectMessage;
//# sourceMappingURL=RezObject.js.map