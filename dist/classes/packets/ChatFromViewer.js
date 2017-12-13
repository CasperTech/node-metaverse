"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ChatFromViewerPacket {
    constructor() {
        this.name = 'ChatFromViewer';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901840;
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
        buf.write(this.ChatData['Message'], pos);
        pos += this.ChatData['Message'].length;
        buf.writeUInt8(this.ChatData['Type'], pos++);
        buf.writeInt32LE(this.ChatData['Channel'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
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
            Message: '',
            Type: 0,
            Channel: 0
        };
        newObjChatData['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjChatData['Type'] = buf.readUInt8(pos++);
        newObjChatData['Channel'] = buf.readInt32LE(pos);
        pos += 4;
        this.ChatData = newObjChatData;
        return pos - startPos;
    }
}
exports.ChatFromViewerPacket = ChatFromViewerPacket;
//# sourceMappingURL=ChatFromViewer.js.map