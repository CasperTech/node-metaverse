"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AvatarInterestsReplyMessage {
    constructor() {
        this.name = 'AvatarInterestsReply';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AvatarInterestsReply;
    }
    getSize() {
        return (this.PropertiesData['WantToText'].length + 1 + this.PropertiesData['SkillsText'].length + 1 + this.PropertiesData['LanguagesText'].length + 1) + 40;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['AvatarID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.PropertiesData['WantToMask'], pos);
        pos += 4;
        buf.writeUInt8(this.PropertiesData['WantToText'].length, pos++);
        this.PropertiesData['WantToText'].copy(buf, pos);
        pos += this.PropertiesData['WantToText'].length;
        buf.writeUInt32LE(this.PropertiesData['SkillsMask'], pos);
        pos += 4;
        buf.writeUInt8(this.PropertiesData['SkillsText'].length, pos++);
        this.PropertiesData['SkillsText'].copy(buf, pos);
        pos += this.PropertiesData['SkillsText'].length;
        buf.writeUInt8(this.PropertiesData['LanguagesText'].length, pos++);
        this.PropertiesData['LanguagesText'].copy(buf, pos);
        pos += this.PropertiesData['LanguagesText'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            AvatarID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['AvatarID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjPropertiesData = {
            WantToMask: 0,
            WantToText: Buffer.allocUnsafe(0),
            SkillsMask: 0,
            SkillsText: Buffer.allocUnsafe(0),
            LanguagesText: Buffer.allocUnsafe(0)
        };
        newObjPropertiesData['WantToMask'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjPropertiesData['WantToText'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjPropertiesData['SkillsMask'] = buf.readUInt32LE(pos);
        pos += 4;
        varLength = buf.readUInt8(pos++);
        newObjPropertiesData['SkillsText'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjPropertiesData['LanguagesText'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.PropertiesData = newObjPropertiesData;
        return pos - startPos;
    }
}
exports.AvatarInterestsReplyMessage = AvatarInterestsReplyMessage;
//# sourceMappingURL=AvatarInterestsReply.js.map