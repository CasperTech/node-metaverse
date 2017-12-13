"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RezSingleAttachmentFromInvPacket {
    constructor() {
        this.name = 'RezSingleAttachmentFromInv';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902155;
    }
    getSize() {
        return (this.ObjectData['Name'].length + 1 + this.ObjectData['Description'].length + 1) + 81;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ObjectData['ItemID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ObjectData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ObjectData['AttachmentPt'], pos++);
        buf.writeUInt32LE(this.ObjectData['ItemFlags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ObjectData['GroupMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ObjectData['EveryoneMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.ObjectData['NextOwnerMask'], pos);
        pos += 4;
        buf.write(this.ObjectData['Name'], pos);
        pos += this.ObjectData['Name'].length;
        buf.write(this.ObjectData['Description'], pos);
        pos += this.ObjectData['Description'].length;
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
        const newObjObjectData = {
            ItemID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            AttachmentPt: 0,
            ItemFlags: 0,
            GroupMask: 0,
            EveryoneMask: 0,
            NextOwnerMask: 0,
            Name: '',
            Description: ''
        };
        newObjObjectData['ItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjObjectData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjObjectData['AttachmentPt'] = buf.readUInt8(pos++);
        newObjObjectData['ItemFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjObjectData['GroupMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjObjectData['EveryoneMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjObjectData['NextOwnerMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjObjectData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjObjectData['Description'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ObjectData = newObjObjectData;
        return pos - startPos;
    }
}
exports.RezSingleAttachmentFromInvPacket = RezSingleAttachmentFromInvPacket;
//# sourceMappingURL=RezSingleAttachmentFromInv.js.map