"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ErrorPacket {
    constructor() {
        this.name = 'Error';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902183;
    }
    getSize() {
        return (this.Data['Token'].length + 1 + this.Data['System'].length + 1 + this.Data['Message'].length + 2 + this.Data['Data'].length + 2) + 36;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt32LE(this.Data['Code'], pos);
        pos += 4;
        buf.write(this.Data['Token'], pos);
        pos += this.Data['Token'].length;
        this.Data['ID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.Data['System'], pos);
        pos += this.Data['System'].length;
        buf.write(this.Data['Message'], pos);
        pos += this.Data['Message'].length;
        buf.write(this.Data['Data'], pos);
        pos += this.Data['Data'].length;
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
        const newObjData = {
            Code: 0,
            Token: '',
            ID: UUID_1.UUID.zero(),
            System: '',
            Message: '',
            Data: ''
        };
        newObjData['Code'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['Token'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['ID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['System'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjData['Data'] = buf.toString('utf8', pos, length);
        pos += length;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.ErrorPacket = ErrorPacket;
//# sourceMappingURL=Error.js.map