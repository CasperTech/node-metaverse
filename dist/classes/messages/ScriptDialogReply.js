"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ScriptDialogReplyMessage {
    constructor() {
        this.name = 'ScriptDialogReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ScriptDialogReply;
    }
    getSize() {
        return (this.Data['ButtonLabel'].length + 1) + 56;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.Data['ChatChannel'], pos);
        pos += 4;
        buf.writeInt32LE(this.Data['ButtonIndex'], pos);
        pos += 4;
        buf.writeUInt8(this.Data['ButtonLabel'].length, pos++);
        this.Data['ButtonLabel'].copy(buf, pos);
        pos += this.Data['ButtonLabel'].length;
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
        const newObjData = {
            ObjectID: UUID_1.UUID.zero(),
            ChatChannel: 0,
            ButtonIndex: 0,
            ButtonLabel: Buffer.allocUnsafe(0)
        };
        newObjData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['ChatChannel'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['ButtonIndex'] = buf.readInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjData['ButtonLabel'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.ScriptDialogReplyMessage = ScriptDialogReplyMessage;
//# sourceMappingURL=ScriptDialogReply.js.map