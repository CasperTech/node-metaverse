"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RezMultipleAttachmentsFromInvMessage {
    constructor() {
        this.name = 'RezMultipleAttachmentsFromInv';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RezMultipleAttachmentsFromInv;
    }
    getSize() {
        return ((this.calculateVarVarSize(this.ObjectData, 'Name', 1) + this.calculateVarVarSize(this.ObjectData, 'Description', 1) + 49) * this.ObjectData.length) + 51;
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
        this.HeaderData['CompoundMsgID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.HeaderData['TotalObjects'], pos++);
        buf.writeUInt8((this.HeaderData['FirstDetachAll']) ? 1 : 0, pos++);
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ObjectData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ObjectData[i]['OwnerID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeUInt8(this.ObjectData[i]['AttachmentPt'], pos++);
            buf.writeUInt32LE(this.ObjectData[i]['ItemFlags'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['GroupMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['EveryoneMask'], pos);
            pos += 4;
            buf.writeUInt32LE(this.ObjectData[i]['NextOwnerMask'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['Name'].length, pos++);
            this.ObjectData[i]['Name'].copy(buf, pos);
            pos += this.ObjectData[i]['Name'].length;
            buf.writeUInt8(this.ObjectData[i]['Description'].length, pos++);
            this.ObjectData[i]['Description'].copy(buf, pos);
            pos += this.ObjectData[i]['Description'].length;
        }
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
        const newObjHeaderData = {
            CompoundMsgID: UUID_1.UUID.zero(),
            TotalObjects: 0,
            FirstDetachAll: false
        };
        newObjHeaderData['CompoundMsgID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjHeaderData['TotalObjects'] = buf.readUInt8(pos++);
        newObjHeaderData['FirstDetachAll'] = (buf.readUInt8(pos++) === 1);
        this.HeaderData = newObjHeaderData;
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++) {
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
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.RezMultipleAttachmentsFromInvMessage = RezMultipleAttachmentsFromInvMessage;
//# sourceMappingURL=RezMultipleAttachmentsFromInv.js.map