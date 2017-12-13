"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ChatPassMessage {
    constructor() {
        this.name = 'ChatPass';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ChatPass;
    }
    getSize() {
        return (this.ChatData['Name'].length + 1 + this.ChatData['Message'].length + 2) + 55;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        buf.writeInt32LE(this.ChatData['Channel'], pos);
        pos += 4;
        this.ChatData['Position'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ChatData['ID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ChatData['OwnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ChatData['Name'].length, pos++);
        this.ChatData['Name'].copy(buf, pos);
        pos += this.ChatData['Name'].length;
        buf.writeUInt8(this.ChatData['SourceType'], pos++);
        buf.writeUInt8(this.ChatData['Type'], pos++);
        buf.writeFloatLE(this.ChatData['Radius'], pos);
        pos += 4;
        buf.writeUInt8(this.ChatData['SimAccess'], pos++);
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
            Channel: 0,
            Position: Vector3_1.Vector3.getZero(),
            ID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            Name: Buffer.allocUnsafe(0),
            SourceType: 0,
            Type: 0,
            Radius: 0,
            SimAccess: 0,
            Message: Buffer.allocUnsafe(0)
        };
        newObjChatData['Channel'] = buf.readInt32LE(pos);
        pos += 4;
        newObjChatData['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjChatData['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjChatData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjChatData['Name'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjChatData['SourceType'] = buf.readUInt8(pos++);
        newObjChatData['Type'] = buf.readUInt8(pos++);
        newObjChatData['Radius'] = buf.readFloatLE(pos);
        pos += 4;
        newObjChatData['SimAccess'] = buf.readUInt8(pos++);
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjChatData['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ChatData = newObjChatData;
        return pos - startPos;
    }
}
exports.ChatPassMessage = ChatPassMessage;
//# sourceMappingURL=ChatPass.js.map