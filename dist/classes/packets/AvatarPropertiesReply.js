"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AvatarPropertiesReplyPacket {
    constructor() {
        this.name = 'AvatarPropertiesReply';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901931;
    }
    getSize() {
        return (this.PropertiesData['AboutText'].length + 2 + this.PropertiesData['FLAboutText'].length + 1 + this.PropertiesData['BornOn'].length + 1 + this.PropertiesData['ProfileURL'].length + 1 + this.PropertiesData['CharterMember'].length + 1) + 84;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['AvatarID'].writeToBuffer(buf, pos);
        pos += 16;
        this.PropertiesData['ImageID'].writeToBuffer(buf, pos);
        pos += 16;
        this.PropertiesData['FLImageID'].writeToBuffer(buf, pos);
        pos += 16;
        this.PropertiesData['PartnerID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.PropertiesData['AboutText'], pos);
        pos += this.PropertiesData['AboutText'].length;
        buf.write(this.PropertiesData['FLAboutText'], pos);
        pos += this.PropertiesData['FLAboutText'].length;
        buf.write(this.PropertiesData['BornOn'], pos);
        pos += this.PropertiesData['BornOn'].length;
        buf.write(this.PropertiesData['ProfileURL'], pos);
        pos += this.PropertiesData['ProfileURL'].length;
        buf.write(this.PropertiesData['CharterMember'], pos);
        pos += this.PropertiesData['CharterMember'].length;
        buf.writeUInt32LE(this.PropertiesData['Flags'], pos);
        pos += 4;
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
            ImageID: UUID_1.UUID.zero(),
            FLImageID: UUID_1.UUID.zero(),
            PartnerID: UUID_1.UUID.zero(),
            AboutText: '',
            FLAboutText: '',
            BornOn: '',
            ProfileURL: '',
            CharterMember: '',
            Flags: 0
        };
        newObjPropertiesData['ImageID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjPropertiesData['FLImageID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjPropertiesData['PartnerID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjPropertiesData['AboutText'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjPropertiesData['FLAboutText'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjPropertiesData['BornOn'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjPropertiesData['ProfileURL'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjPropertiesData['CharterMember'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjPropertiesData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.PropertiesData = newObjPropertiesData;
        return pos - startPos;
    }
}
exports.AvatarPropertiesReplyPacket = AvatarPropertiesReplyPacket;
//# sourceMappingURL=AvatarPropertiesReply.js.map