"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class InitiateDownloadMessage {
    constructor() {
        this.name = 'InitiateDownload';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.InitiateDownload;
    }
    getSize() {
        return (this.FileData['SimFilename'].length + 1 + this.FileData['ViewerFilename'].length + 1) + 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.FileData['SimFilename'].length, pos++);
        this.FileData['SimFilename'].copy(buf, pos);
        pos += this.FileData['SimFilename'].length;
        buf.writeUInt8(this.FileData['ViewerFilename'].length, pos++);
        this.FileData['ViewerFilename'].copy(buf, pos);
        pos += this.FileData['ViewerFilename'].length;
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
        const newObjFileData = {
            SimFilename: Buffer.allocUnsafe(0),
            ViewerFilename: Buffer.allocUnsafe(0)
        };
        varLength = buf.readUInt8(pos++);
        newObjFileData['SimFilename'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjFileData['ViewerFilename'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.FileData = newObjFileData;
        return pos - startPos;
    }
}
exports.InitiateDownloadMessage = InitiateDownloadMessage;
//# sourceMappingURL=InitiateDownload.js.map