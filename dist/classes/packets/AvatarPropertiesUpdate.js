"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class AvatarPropertiesUpdatePacket {
    constructor() {
        this.name = 'AvatarPropertiesUpdate';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901934;
    }
    getSize() {
        return (this.PropertiesData['AboutText'].length + 2 + this.PropertiesData['FLAboutText'].length + 1 + this.PropertiesData['ProfileURL'].length + 1) + 66;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.PropertiesData['ImageID'].writeToBuffer(buf, pos);
        pos += 16;
        this.PropertiesData['FLImageID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.PropertiesData['AboutText'], pos);
        pos += this.PropertiesData['AboutText'].length;
        buf.write(this.PropertiesData['FLAboutText'], pos);
        pos += this.PropertiesData['FLAboutText'].length;
        buf.writeUInt8((this.PropertiesData['AllowPublish']) ? 1 : 0, pos++);
        buf.writeUInt8((this.PropertiesData['MaturePublish']) ? 1 : 0, pos++);
        buf.write(this.PropertiesData['ProfileURL'], pos);
        pos += this.PropertiesData['ProfileURL'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjPropertiesData = {
            ImageID: UUID_1.UUID.zero(),
            FLImageID: UUID_1.UUID.zero(),
            AboutText: '',
            FLAboutText: '',
            AllowPublish: false,
            MaturePublish: false,
            ProfileURL: ''
        };
        newObjPropertiesData['ImageID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjPropertiesData['FLImageID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjPropertiesData['AboutText'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjPropertiesData['FLAboutText'] = buf.toString('utf8', pos, length);
        pos += length;
        newObjPropertiesData['AllowPublish'] = (buf.readUInt8(pos++) === 1);
        newObjPropertiesData['MaturePublish'] = (buf.readUInt8(pos++) === 1);
        newObjPropertiesData['ProfileURL'] = buf.toString('utf8', pos, length);
        pos += length;
        this.PropertiesData = newObjPropertiesData;
        return pos - startPos;
    }
}
exports.AvatarPropertiesUpdatePacket = AvatarPropertiesUpdatePacket;
//# sourceMappingURL=AvatarPropertiesUpdate.js.map