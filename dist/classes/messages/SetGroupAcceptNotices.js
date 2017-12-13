"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class SetGroupAcceptNoticesMessage {
    constructor() {
        this.name = 'SetGroupAcceptNotices';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.SetGroupAcceptNotices;
    }
    getSize() {
        return 50;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.Data['AcceptNotices']) ? 1 : 0, pos++);
        buf.writeUInt8((this.NewData['ListInProfile']) ? 1 : 0, pos++);
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
            GroupID: UUID_1.UUID.zero(),
            AcceptNotices: false
        };
        newObjData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['AcceptNotices'] = (buf.readUInt8(pos++) === 1);
        this.Data = newObjData;
        const newObjNewData = {
            ListInProfile: false
        };
        newObjNewData['ListInProfile'] = (buf.readUInt8(pos++) === 1);
        this.NewData = newObjNewData;
        return pos - startPos;
    }
}
exports.SetGroupAcceptNoticesMessage = SetGroupAcceptNoticesMessage;
//# sourceMappingURL=SetGroupAcceptNotices.js.map