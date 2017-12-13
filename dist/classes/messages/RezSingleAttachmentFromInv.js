"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RezSingleAttachmentFromInvMessage {
    constructor() {
        this.name = 'RezSingleAttachmentFromInv';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RezSingleAttachmentFromInv;
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
        buf.writeUInt8(this.ObjectData['Name'].length, pos++);
        this.ObjectData['Name'].copy(buf, pos);
        pos += this.ObjectData['Name'].length;
        buf.writeUInt8(this.ObjectData['Description'].length, pos++);
        this.ObjectData['Description'].copy(buf, pos);
        pos += this.ObjectData['Description'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
            Name: Buffer.allocUnsafe(0),
            Description: Buffer.allocUnsafe(0)
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
        varLength = buf.readUInt8(pos++);
        newObjObjectData['Name'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjObjectData['Description'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ObjectData = newObjObjectData;
        return pos - startPos;
    }
}
exports.RezSingleAttachmentFromInvMessage = RezSingleAttachmentFromInvMessage;
//# sourceMappingURL=RezSingleAttachmentFromInv.js.map