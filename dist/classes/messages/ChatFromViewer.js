"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ChatFromViewerMessage {
    constructor() {
        this.name = 'ChatFromViewer';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ChatFromViewer;
    }
    getSize() {
        return (this.ChatData['Message'].length + 2) + 37;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt16LE(this.ChatData['Message'].length, pos);
        pos += 2;
        this.ChatData['Message'].copy(buf, pos);
        pos += this.ChatData['Message'].length;
        buf.writeUInt8(this.ChatData['Type'], pos++);
        buf.writeInt32LE(this.ChatData['Channel'], pos);
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
        const newObjChatData = {
            Message: Buffer.allocUnsafe(0),
            Type: 0,
            Channel: 0
        };
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjChatData['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjChatData['Type'] = buf.readUInt8(pos++);
        newObjChatData['Channel'] = buf.readInt32LE(pos);
        pos += 4;
        this.ChatData = newObjChatData;
        return pos - startPos;
    }
}
exports.ChatFromViewerMessage = ChatFromViewerMessage;
//# sourceMappingURL=ChatFromViewer.js.map