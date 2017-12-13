"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AvatarPropertiesRequestBackendMessage {
    constructor() {
        this.name = 'AvatarPropertiesRequestBackend';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AvatarPropertiesRequestBackend;
    }
    getSize() {
        return 34;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['AvatarID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.AgentData['GodLevel'], pos++);
        buf.writeUInt8((this.AgentData['WebProfilesDisabled']) ? 1 : 0, pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            AvatarID: UUID_1.UUID.zero(),
            GodLevel: 0,
            WebProfilesDisabled: false
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['AvatarID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GodLevel'] = buf.readUInt8(pos++);
        newObjAgentData['WebProfilesDisabled'] = (buf.readUInt8(pos++) === 1);
        this.AgentData = newObjAgentData;
        return pos - startPos;
    }
}
exports.AvatarPropertiesRequestBackendMessage = AvatarPropertiesRequestBackendMessage;
//# sourceMappingURL=AvatarPropertiesRequestBackend.js.map