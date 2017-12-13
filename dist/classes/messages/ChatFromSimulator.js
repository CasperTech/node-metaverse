"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ChatFromSimulatorMessage {
    constructor() {
        this.name = 'ChatFromSimulator';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ChatFromSimulator;
    }
    getSize() {
        return (this.ChatData['FromName'].length + 1 + this.ChatData['Message'].length + 2) + 47;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeUInt8(this.ChatData['FromName'].length, pos++);
        this.ChatData['FromName'].copy(buf, pos);
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
        buf.writeUInt16LE(this.ChatData['Message'].length, pos);
        pos += 2;
        this.ChatData['Message'].copy(buf, pos);
        pos += this.ChatData['Message'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjChatData = {
            FromName: Buffer.allocUnsafe(0),
            SourceID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            SourceType: 0,
            ChatType: 0,
            Audible: 0,
            Position: Vector3_1.Vector3.getZero(),
            Message: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt8(pos++);
        newObjChatData['FromName'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjChatData['SourceID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjChatData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjChatData['SourceType'] = buf.readUInt8(pos++);
        newObjChatData['ChatType'] = buf.readUInt8(pos++);
        newObjChatData['Audible'] = buf.readUInt8(pos++);
        newObjChatData['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjChatData['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ChatData = newObjChatData;
        return pos - startPos;
    }
}
exports.ChatFromSimulatorMessage = ChatFromSimulatorMessage;
//# sourceMappingURL=ChatFromSimulator.js.map