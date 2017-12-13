"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ChatPassPacket {
    constructor() {
        this.name = 'ChatPass';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901999;
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
        buf.write(this.ChatData['Name'], pos);
        pos += this.ChatData['Name'].length;
        buf.writeUInt8(this.ChatData['SourceType'], pos++);
        buf.writeUInt8(this.ChatData['Type'], pos++);
        buf.writeFloatLE(this.ChatData['Radius'], pos);
        pos += 4;
        buf.writeUInt8(this.ChatData['SimAccess'], pos++);
        buf.write(this.ChatData['Message'], pos);
        pos += this.ChatData['Message'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjChatData = {
            Channel: 0,
            Position: Vector3_1.Vector3.getZero(),
            ID: UUID_1.UUID.zero(),
            OwnerID: UUID_1.UUID.zero(),
            Name: '',
            SourceType: 0,
            Type: 0,
            Radius: 0,
            SimAccess: 0,
            Message: ''
        };
        newObjChatData['Channel'] = buf.readInt32LE(pos);
        pos += 4;
        newObjChatData['Position'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjChatData['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjChatData['OwnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjChatData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjChatData['SourceType'] = buf.readUInt8(pos++);
        newObjChatData['Type'] = buf.readUInt8(pos++);
        newObjChatData['Radius'] = buf.readFloatLE(pos);
        pos += 4;
        newObjChatData['SimAccess'] = buf.readUInt8(pos++);
        newObjChatData['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ChatData = newObjChatData;
        return pos - startPos;
    }
}
exports.ChatPassPacket = ChatPassPacket;
//# sourceMappingURL=ChatPass.js.map