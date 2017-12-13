"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class StartLurePacket {
    constructor() {
        this.name = 'StartLure';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901830;
    }
    getSize() {
        return (this.Info['Message'].length + 1) + ((16) * this.TargetData.length) + 34;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.Info['LureType'], pos++);
        buf.write(this.Info['Message'], pos);
        pos += this.Info['Message'].length;
        const count = this.TargetData.length;
        buf.writeUInt8(this.TargetData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.TargetData[i]['TargetID'].writeToBuffer(buf, pos);
            pos += 16;
        }
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
        const newObjInfo = {
            LureType: 0,
            Message: ''
        };
        newObjInfo['LureType'] = buf.readUInt8(pos++);
        newObjInfo['Message'] = buf.toString('utf8', pos, length);
        pos += length;
        this.Info = newObjInfo;
        const count = buf.readUInt8(pos++);
        this.TargetData = [];
        for (let i = 0; i < count; i++) {
            const newObjTargetData = {
                TargetID: UUID_1.UUID.zero()
            };
            newObjTargetData['TargetID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.TargetData.push(newObjTargetData);
        }
        return pos - startPos;
    }
}
exports.StartLurePacket = StartLurePacket;
//# sourceMappingURL=StartLure.js.map