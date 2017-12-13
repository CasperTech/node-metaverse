"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class EventInfoReplyPacket {
    constructor() {
        this.name = 'EventInfoReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901940;
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
        buf.write(this.EventData['Creator'], pos);
        pos += this.EventData['Creator'].length;
        buf.write(this.EventData['Name'], pos);
        pos += this.EventData['Name'].length;
        buf.write(this.EventData['Category'], pos);
        pos += this.EventData['Category'].length;
        buf.write(this.EventData['Desc'], pos);
        pos += this.EventData['Desc'].length;
        buf.write(this.EventData['Date'], pos);
        pos += this.EventData['Date'].length;
        buf.writeUInt32LE(this.EventData['DateUTC'], pos);
        pos += 4;
        buf.writeUInt32LE(this.EventData['Duration'], pos);
        pos += 4;
        buf.writeUInt32LE(this.EventData['Cover'], pos);
        pos += 4;
        buf.writeUInt32LE(this.EventData['Amount'], pos);
        pos += 4;
        buf.write(this.EventData['SimName'], pos);
        pos += this.EventData['SimName'].length;
        this.EventData['GlobalPos'].writeToBuffer(buf, pos, true);
        pos += 24;
        buf.writeUInt32LE(this.EventData['EventFlags'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjEventData = {
            EventID: 0,
            Creator: '',
            Name: '',
            Category: '',
            Desc: '',
            Date: '',
            DateUTC: 0,
            Duration: 0,
            Cover: 0,
            Amount: 0,
            SimName: '',
            GlobalPos: Vector3_1.Vector3.getZero(),
            EventFlags: 0
        };
        newObjEventData['EventID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjEventData['Creator'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjEventData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjEventData['Category'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjEventData['Desc'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjEventData['Date'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjEventData['DateUTC'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjEventData['Duration'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjEventData['Cover'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjEventData['Amount'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjEventData['SimName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjEventData['GlobalPos'] = new Vector3_1.Vector3(buf, pos, true);
        pos += 24;
        newObjEventData['EventFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.EventData = newObjEventData;
        return pos - startPos;
    }
}
exports.EventInfoReplyPacket = EventInfoReplyPacket;
//# sourceMappingURL=EventInfoReply.js.map