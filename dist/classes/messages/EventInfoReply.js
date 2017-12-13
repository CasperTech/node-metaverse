"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class EventInfoReplyMessage {
    constructor() {
        this.name = 'EventInfoReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.EventInfoReply;
    }
    getSize() {
        return (this.EventData['Creator'].length + 1 + this.EventData['Name'].length + 1 + this.EventData['Category'].length + 1 + this.EventData['Desc'].length + 2 + this.EventData['Date'].length + 1 + this.EventData['SimName'].length + 1) + 64;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.EventData['EventID'], pos);
        pos += 4;
        buf.writeUInt8(this.EventData['Creator'].length, pos++);
        this.EventData['Creator'].copy(buf, pos);
        pos += this.EventData['Creator'].length;
        buf.writeUInt8(this.EventData['Name'].length, pos++);
        this.EventData['Name'].copy(buf, pos);
        pos += this.EventData['Name'].length;
        buf.writeUInt8(this.EventData['Category'].length, pos++);
        this.EventData['Category'].copy(buf, pos);
        pos += this.EventData['Category'].length;
        buf.writeUInt16LE(this.EventData['Desc'].length, pos);
        pos += 2;
        this.EventData['Desc'].copy(buf, pos);
        pos += this.EventData['Desc'].length;
        buf.writeUInt8(this.EventData['Date'].length, pos++);
        this.EventData['Date'].copy(buf, pos);
        pos += this.EventData['Date'].length;
        buf.writeUInt32LE(this.EventData['DateUTC'], pos);
        pos += 4;
        buf.writeUInt32LE(this.EventData['Duration'], pos);
        pos += 4;
        buf.writeUInt32LE(this.EventData['Cover'], pos);
        pos += 4;
        buf.writeUInt32LE(this.EventData['Amount'], pos);
        pos += 4;
        buf.writeUInt8(this.EventData['SimName'].length, pos++);
        this.EventData['SimName'].copy(buf, pos);
        pos += this.EventData['SimName'].length;
        this.EventData['GlobalPos'].writeToBuffer(buf, pos, true);
        pos += 24;
        buf.writeUInt32LE(this.EventData['EventFlags'], pos);
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
        const newObjEventData = {
            EventID: 0,
            Creator: Buffer.allocUnsafe(0),
            Name: Buffer.allocUnsafe(0),
            Category: Buffer.allocUnsafe(0),
            Desc: Buffer.allocUnsafe(0),
            Date: Buffer.allocUnsafe(0),
            DateUTC: 0,
            Duration: 0,
            Cover: 0,
            Amount: 0,
            SimName: Buffer.allocUnsafe(0),
            GlobalPos: Vector3_1.Vector3.getZero(),
            EventFlags: 0
        };
        newObjEventData['EventID'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjEventData['Creator'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjEventData['Name'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjEventData['Category'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjEventData['Desc'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjEventData['Date'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjEventData['DateUTC'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjEventData['Duration'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjEventData['Cover'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjEventData['Amount'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjEventData['SimName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjEventData['GlobalPos'] = new Vector3_1.Vector3(buf, pos, true);
        pos += 24;
        newObjEventData['EventFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.EventData = newObjEventData;
        return pos - startPos;
    }
}
exports.EventInfoReplyMessage = EventInfoReplyMessage;
//# sourceMappingURL=EventInfoReply.js.map