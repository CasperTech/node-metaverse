"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ObjectPropertiesFamilyPacket {
    constructor() {
        this.name = 'ObjectPropertiesFamily';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = 65290;
    }
    getSize() {
        return (this.ObjectData['Name'].length + 1 + this.ObjectData['Description'].length + 1) + 101;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt32LE(this.ObjectData['RequestFlags'], pos);
        pos += 4;
        this.ObjectData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ObjectData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ObjectData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.ObjectData['BaseMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ObjectData['OwnerMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ObjectData['GroupMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ObjectData['EveryoneMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ObjectData['NextOwnerMask'], pos);
        pos += 4;
        buf.writeInt32LE(this.ObjectData['OwnershipCost'], pos);
        pos += 4;
        buf.writeUInt8(this.ObjectData['SaleType'], pos++);
        buf.writeInt32LE(this.ObjectData['SalePrice'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ObjectData['Category'], pos);
        pos += 4;
        this.ObjectData['LastOwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.ObjectData['Name'], pos);
        pos += this.ObjectData['Name'].length;
        buf.write(this.ObjectData['Description'], pos);
        pos += this.ObjectData['Description'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjObjectData = {
            RequestFlags: 0,
            ObjectID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero(),
            BaseMask: 0,
            OwnerMask: 0,
            GroupMask: 0,
            EveryoneMask: 0,
            NextOwnerMask: 0,
            OwnershipCost: 0,
            SaleType: 0,
            SalePrice: 0,
            Category: 0,
            LastOwnerID: UUID_1.UUID.zero(),
            Name: '',
            Description: ''
        };
        newObjObjectData['RequestFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjObjectData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjObjectData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjObjectData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
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
        newObjObjectData['Category'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjObjectData['LastOwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjObjectData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjObjectData['Description'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ObjectData = newObjObjectData;
        return pos - startPos;
    }
}
exports.ObjectPropertiesFamilyPacket = ObjectPropertiesFamilyPacket;
//# sourceMappingURL=ObjectPropertiesFamily.js.map