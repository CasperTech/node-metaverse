"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class StartLureMessage {
    constructor() {
        this.name = 'StartLure';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.StartLure;
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
        buf.writeUInt8(this.Info['Message'].length, pos++);
        this.Info['Message'].copy(buf, pos);
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
        const newObjInfo = {
            LureType: 0,
            Message: Buffer.allocUnsafe(0)
        };
        newObjInfo['LureType'] = buf.readUInt8(pos++);
        varLength = buf.readUInt8(pos++);
        newObjInfo['Message'] = buf.slice(pos, pos + varLength);
        pos += varLength;
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
exports.StartLureMessage = StartLureMessage;
//# sourceMappingURL=StartLure.js.map