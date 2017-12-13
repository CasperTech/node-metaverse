"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ImprovedInstantMessageMessage {
    constructor() {
        this.name = 'ImprovedInstantMessage';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ImprovedInstantMessage;
    }
    getSize() {
        return (this.MessageBlock['FromAgentName'].length + 1 + this.MessageBlock['Message'].length + 2 + this.MessageBlock['BinaryBucket'].length + 2) + 107;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.MessageBlock['FromGroup']) ? 1 : 0, pos++);
        this.MessageBlock['ToAgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.MessageBlock['ParentEstateID'], pos);
        pos += 4;
        this.MessageBlock['RegionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.MessageBlock['Position'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt8(this.MessageBlock['Offline'], pos++);
        buf.writeUInt8(this.MessageBlock['Dialog'], pos++);
        this.MessageBlock['ID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.MessageBlock['Timestamp'], pos);
        pos += 4;
        buf.writeUInt8(this.MessageBlock['FromAgentName'].length, pos++);
        this.MessageBlock['FromAgentName'].copy(buf, pos);
        pos += this.MessageBlock['FromAgentName'].length;
        buf.writeUInt16LE(this.MessageBlock['Message'].length, pos);
        pos += 2;
        this.MessageBlock['Message'].copy(buf, pos);
        pos += this.MessageBlock['Message'].length;
        buf.writeUInt16LE(this.MessageBlock['BinaryBucket'].length, pos);
        pos += 2;
        this.MessageBlock['BinaryBucket'].copy(buf, pos);
        pos += this.MessageBlock['BinaryBucket'].length;
        buf.writeUInt32LE(this.EstateBlock['EstateID'], pos);
        pos += 4;
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
        const newObjMessageBlock = {
            FromGroup: false,
            ToAgentID: UUID_1.UUID.zero(),
            ParentEstateID: 0,
            RegionID: UUID_1.UUID.zero(),
            Position: Vector3_1.Vector3.getZero(),
            Offline: 0,
            Dialog: 0,
            ID: UUID_1.UUID.zero(),
            Timestamp: 0,
            FromAgentName: Buffer.allocUnsafe(0),
            Message: Buffer.allocUnsafe(0),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        newObjMessageBlock['FromGroup'] = (buf.readUInt8(pos++) === 1);
        newObjMessageBlock['ToAgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMessageBlock['ParentEstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjMessageBlock['RegionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMessageBlock['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjMessageBlock['Offline'] = buf.readUInt8(pos++);
        newObjMessageBlock['Dialog'] = buf.readUInt8(pos++);
        newObjMessageBlock['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjMessageBlock['Timestamp'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjMessageBlock['FromAgentName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjMessageBlock['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjMessageBlock['BinaryBucket'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.MessageBlock = newObjMessageBlock;
        const newObjEstateBlock = {
            EstateID: 0
        };
        newObjEstateBlock['EstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        this.EstateBlock = newObjEstateBlock;
        return pos - startPos;
    }
}
exports.ImprovedInstantMessageMessage = ImprovedInstantMessageMessage;
//# sourceMappingURL=ImprovedInstantMessage.js.map