"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ClassifiedInfoReplyMessage {
    constructor() {
        this.name = 'ClassifiedInfoReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ClassifiedInfoReply;
    }
    getSize() {
        return (this.Data['Name'].length + 1 + this.Data['Desc'].length + 2 + this.Data['SimName'].length + 1 + this.Data['ParcelName'].length + 1) + 125;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['ClassifiedID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['CreatorID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Data['CreationDate'], pos);
        pos += 4;
        buf.writeUInt32LE(this.Data['ExpirationDate'], pos);
        pos += 4;
        buf.writeUInt32LE(this.Data['Category'], pos);
        pos += 4;
        buf.writeUInt8(this.Data['Name'].length, pos++);
        this.Data['Name'].copy(buf, pos);
        pos += this.Data['Name'].length;
        buf.writeUInt16LE(this.Data['Desc'].length, pos);
        pos += 2;
        this.Data['Desc'].copy(buf, pos);
        pos += this.Data['Desc'].length;
        this.Data['ParcelID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Data['ParentEstate'], pos);
        pos += 4;
        this.Data['SnapshotID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.Data['SimName'].length, pos++);
        this.Data['SimName'].copy(buf, pos);
        pos += this.Data['SimName'].length;
        this.Data['PosGlobal'].writeToBuffer(buf, pos, true);
        pos += 24;
        buf.writeUInt8(this.Data['ParcelName'].length, pos++);
        this.Data['ParcelName'].copy(buf, pos);
        pos += this.Data['ParcelName'].length;
        buf.writeUInt8(this.Data['ClassifiedFlags'], pos++);
        buf.writeInt32LE(this.Data['PriceForListing'], pos);
        pos += 4;
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
        const newObjData = {
            ClassifiedID: UUID_1.UUID.zero(),
            CreatorID: UUID_1.UUID.zero(),
            CreationDate: 0,
            ExpirationDate: 0,
            Category: 0,
            Name: Buffer.allocUnsafe(0),
            Desc: Buffer.allocUnsafe(0),
            ParcelID: UUID_1.UUID.zero(),
            ParentEstate: 0,
            SnapshotID: UUID_1.UUID.zero(),
            SimName: Buffer.allocUnsafe(0),
            PosGlobal: Vector3_1.Vector3.getZero(),
            ParcelName: Buffer.allocUnsafe(0),
            ClassifiedFlags: 0,
            PriceForListing: 0
        };
        newObjData['ClassifiedID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['CreatorID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['CreationDate'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjData['ExpirationDate'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjData['Category'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjData['Name'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjData['Desc'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjData['ParcelID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['ParentEstate'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjData['SnapshotID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjData['SimName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjData['PosGlobal'] = new Vector3_1.Vector3(buf, pos, true);
        pos += 24;
        varLength = buf.readUInt8(pos++);
        newObjData['ParcelName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjData['ClassifiedFlags'] = buf.readUInt8(pos++);
        newObjData['PriceForListing'] = buf.readInt32LE(pos);
        pos += 4;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.ClassifiedInfoReplyMessage = ClassifiedInfoReplyMessage;
//# sourceMappingURL=ClassifiedInfoReply.js.map