"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class EjectGroupMemberRequestMessage {
    constructor() {
        this.name = 'EjectGroupMemberRequest';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.EjectGroupMemberRequest;
    }
    getSize() {
        return ((16) * this.EjectData.length) + 49;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.GroupData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.EjectData.length;
        buf.writeUInt8(this.EjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.EjectData[i]['EjecteeID'].writeToBuffer(buf, pos);
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
        const newObjGroupData = {
            GroupID: UUID_1.UUID.zero()
        };
        newObjGroupData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.GroupData = newObjGroupData;
        const count = buf.readUInt8(pos++);
        this.EjectData = [];
        for (let i = 0; i < count; i++) {
            const newObjEjectData = {
                EjecteeID: UUID_1.UUID.zero()
            };
            newObjEjectData['EjecteeID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.EjectData.push(newObjEjectData);
        }
        return pos - startPos;
    }
}
exports.EjectGroupMemberRequestMessage = EjectGroupMemberRequestMessage;
//# sourceMappingURL=EjectGroupMemberRequest.js.map