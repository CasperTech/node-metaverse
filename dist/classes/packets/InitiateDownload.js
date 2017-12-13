"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class InitiateDownloadPacket {
    constructor() {
        this.name = 'InitiateDownload';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902163;
    }
    getSize() {
        return (this.FileData['SimFilename'].length + 1 + this.FileData['ViewerFilename'].length + 1) + 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.FileData['SimFilename'], pos);
        pos += this.FileData['SimFilename'].length;
        buf.write(this.FileData['ViewerFilename'], pos);
        pos += this.FileData['ViewerFilename'].length;
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
        const newObjFileData = {
            SimFilename: '',
            ViewerFilename: ''
        };
        newObjFileData['SimFilename'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjFileData['ViewerFilename'] = buf.toString('utf8', pos, length);
        pos += length;
        this.FileData = newObjFileData;
        return pos - startPos;
    }
}
exports.InitiateDownloadPacket = InitiateDownloadPacket;
//# sourceMappingURL=InitiateDownload.js.map