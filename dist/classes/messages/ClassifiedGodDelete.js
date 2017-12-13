"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ClassifiedGodDeleteMessage {
    constructor() {
        this.name = 'ClassifiedGodDelete';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ClassifiedGodDelete;
    }
    getSize() {
        return 64;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['ClassifiedID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['QueryID'].writeToBuffer(buf, pos);
        pos += 16;
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
            ClassifiedID: UUID_1.UUID.zero(),
            QueryID: UUID_1.UUID.zero()
        };
        newObjData['ClassifiedID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['QueryID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.Data = newObjData;
        return pos - startPos;
    }
}
exports.ClassifiedGodDeleteMessage = ClassifiedGodDeleteMessage;
//# sourceMappingURL=ClassifiedGodDelete.js.map