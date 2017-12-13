"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ChatFromSimulatorPacket {
    constructor() {
        this.name = 'ChatFromSimulator';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901899;
    }
    getSize() {
        return (this.ChatData['FromName'].length + 1 + this.ChatData['Message'].length + 2) + 47;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.write(this.ChatData['FromName'], pos);
        pos += this.ChatData['FromName'].length;
        this.ChatData['SourceID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ChatData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ChatData['SourceType'], pos++);
        buf.writeUInt8(this.ChatData['ChatType'], pos++);
        buf.writeUInt8(this.ChatData['Audible'], pos++);
        this.ChatData['Position'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.write(this.ChatData['Message'], pos);
        pos += this.ChatData['Message'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjChatData = {
            FromName: '',
            SourceID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            SourceType: 0,
            ChatType: 0,
            Audible: 0,
            Position: Vector3_1.Vector3.getZero(),
            Message: ''
        };
        newObjChatData['FromName'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjChatData['SourceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjChatData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjChatData['SourceType'] = buf.readUInt8(pos++);
        newObjChatData['ChatType'] = buf.readUInt8(pos++);
        newObjChatData['Audible'] = buf.readUInt8(pos++);
        newObjChatData['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjChatData['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ChatData = newObjChatData;
        return pos - startPos;
    }
}
exports.ChatFromSimulatorPacket = ChatFromSimulatorPacket;
//# sourceMappingURL=ChatFromSimulator.js.map