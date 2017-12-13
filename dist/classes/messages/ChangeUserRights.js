"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ChangeUserRightsMessage {
    constructor() {
        this.name = 'ChangeUserRights';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.ChangeUserRights;
    }
    getSize() {
        return ((20) * this.Rights.length) + 17;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.Rights.length;
        buf.writeUInt8(this.Rights.length, pos++);
        for (let i = 0; i < count; i++) {
            this.Rights[i]['AgentRelated'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt32LE(this.Rights[i]['RelatedRights'], pos);
            pos += 4;
        }
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
        const count = buf.readUInt8(pos++);
        this.Rights = [];
        for (let i = 0; i < count; i++) {
            const newObjRights = {
                AgentRelated: UUID_1.UUID.zero(),
                RelatedRights: 0
            };
            newObjRights['AgentRelated'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjRights['RelatedRights'] = buf.readInt32LE(pos);
            pos += 4;
            this.Rights.push(newObjRights);
        }
        return pos - startPos;
    }
}
exports.ChangeUserRightsMessage = ChangeUserRightsMessage;
//# sourceMappingURL=ChangeUserRights.js.map