"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SendPostcardMessage {
    constructor() {
        this.name = 'SendPostcard';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SendPostcard;
    }
    getSize() {
        return (this.AgentData['To'].length + 1 + this.AgentData['From'].length + 1 + this.AgentData['Name'].length + 1 + this.AgentData['Subject'].length + 1 + this.AgentData['Msg'].length + 2) + 74;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['AssetID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['PosGlobal'].writeToBuffer(buf, pos, true);
        pos += 24;
        buf.writeUInt8(this.AgentData['To'].length, pos++);
        this.AgentData['To'].copy(buf, pos);
        pos += this.AgentData['To'].length;
        buf.writeUInt8(this.AgentData['From'].length, pos++);
        this.AgentData['From'].copy(buf, pos);
        pos += this.AgentData['From'].length;
        buf.writeUInt8(this.AgentData['Name'].length, pos++);
        this.AgentData['Name'].copy(buf, pos);
        pos += this.AgentData['Name'].length;
        buf.writeUInt8(this.AgentData['Subject'].length, pos++);
        this.AgentData['Subject'].copy(buf, pos);
        pos += this.AgentData['Subject'].length;
        buf.writeUInt16LE(this.AgentData['Msg'].length, pos);
        pos += 2;
        this.AgentData['Msg'].copy(buf, pos);
        pos += this.AgentData['Msg'].length;
        buf.writeUInt8((this.AgentData['AllowPublish']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AgentData['MaturePublish']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            AssetID: UUID_1.UUID.zero(),
            PosGlobal: Vector3_1.Vector3.getZero(),
            To: Buffer.allocUnsafe(0),
            From: Buffer.allocUnsafe(0),
            Name: Buffer.allocUnsafe(0),
            Subject: Buffer.allocUnsafe(0),
            Msg: Buffer.allocUnsafe(0),
            AllowPublish: false,
            MaturePublish: false
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['AssetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['PosGlobal'] = new Vector3_1.Vector3(buf, pos, true);
        pos += 24;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['To'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['From'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['Name'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjAgentData['Subject'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjAgentData['Msg'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjAgentData['AllowPublish'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['MaturePublish'] = (buf.readUInt8(pos++) === 1);
        this.AgentData = newObjAgentData;
        return pos - startPos;
    }
}
exports.SendPostcardMessage = SendPostcardMessage;
//# sourceMappingURL=SendPostcard.js.map