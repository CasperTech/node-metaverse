"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AvatarInterestsReplyPacket {
    constructor() {
        this.name = 'AvatarInterestsReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901932;
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
        buf.write(this.PropertiesData['WantToText'], pos);
        pos += this.PropertiesData['WantToText'].length;
        buf.writeUInt32LE(this.PropertiesData['SkillsMask'], pos);
        pos += 4;
        buf.write(this.PropertiesData['SkillsText'], pos);
        pos += this.PropertiesData['SkillsText'].length;
        buf.write(this.PropertiesData['LanguagesText'], pos);
        pos += this.PropertiesData['LanguagesText'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
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
            WantToText: '',
            SkillsMask: 0,
            SkillsText: '',
            LanguagesText: ''
        };
        newObjPropertiesData['WantToMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjPropertiesData['WantToText'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjPropertiesData['SkillsMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjPropertiesData['SkillsText'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjPropertiesData['LanguagesText'] = buf.toString('utf8', pos, length);
        pos += length;
        this.PropertiesData = newObjPropertiesData;
        return pos - startPos;
    }
}
exports.AvatarInterestsReplyPacket = AvatarInterestsReplyPacket;
//# sourceMappingURL=AvatarInterestsReply.js.map