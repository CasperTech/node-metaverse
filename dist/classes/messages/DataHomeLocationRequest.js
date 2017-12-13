"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class DataHomeLocationRequestMessage {
    constructor() {
        this.name = 'DataHomeLocationRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.DataHomeLocationRequest;
    }
    getSize() {
        return 24;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.Info['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.Info['KickedFromEstateID'], pos);
        pos += 4;
        buf.writeUInt32LE(this.AgentInfo['AgentEffectiveMaturity'], pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjInfo = {
            AgentID: UUID_1.UUID.zero(),
            KickedFromEstateID: 0
        };
        newObjInfo['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInfo['KickedFromEstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        this.Info = newObjInfo;
        const newObjAgentInfo = {
            AgentEffectiveMaturity: 0
        };
        newObjAgentInfo['AgentEffectiveMaturity'] = buf.readUInt32LE(pos);
        pos += 4;
        this.AgentInfo = newObjAgentInfo;
        return pos - startPos;
    }
}
exports.DataHomeLocationRequestMessage = DataHomeLocationRequestMessage;
//# sourceMappingURL=DataHomeLocationRequest.js.map