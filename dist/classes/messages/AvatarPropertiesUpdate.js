"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class AvatarPropertiesUpdateMessage {
    constructor() {
        this.name = 'AvatarPropertiesUpdate';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.AvatarPropertiesUpdate;
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
        buf.writeUInt16LE(this.PropertiesData['AboutText'].length, pos);
        pos += 2;
        this.PropertiesData['AboutText'].copy(buf, pos);
        pos += this.PropertiesData['AboutText'].length;
        buf.writeUInt8(this.PropertiesData['FLAboutText'].length, pos++);
        this.PropertiesData['FLAboutText'].copy(buf, pos);
        pos += this.PropertiesData['FLAboutText'].length;
        buf.writeUInt8((this.PropertiesData['AllowPublish']) ? 1 : 0, pos++);
        buf.writeUInt8((this.PropertiesData['MaturePublish']) ? 1 : 0, pos++);
        buf.writeUInt8(this.PropertiesData['ProfileURL'].length, pos++);
        this.PropertiesData['ProfileURL'].copy(buf, pos);
        pos += this.PropertiesData['ProfileURL'].length;
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
        const newObjPropertiesData = {
            ImageID: UUID_1.UUID.zero(),
            FLImageID: UUID_1.UUID.zero(),
            AboutText: Buffer.allocUnsafe(0),
            FLAboutText: Buffer.allocUnsafe(0),
            AllowPublish: false,
            MaturePublish: false,
            ProfileURL: Buffer.allocUnsafe(0)
        };
        newObjPropertiesData['ImageID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjPropertiesData['FLImageID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt16LE(pos);
        pos += 2;
        newObjPropertiesData['AboutText'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjPropertiesData['FLAboutText'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        newObjPropertiesData['AllowPublish'] = (buf.readUInt8(pos++) === 1);
        newObjPropertiesData['MaturePublish'] = (buf.readUInt8(pos++) === 1);
        varLength = buf.readUInt8(pos++);
        newObjPropertiesData['ProfileURL'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.PropertiesData = newObjPropertiesData;
        return pos - startPos;
    }
}
exports.AvatarPropertiesUpdateMessage = AvatarPropertiesUpdateMessage;
//# sourceMappingURL=AvatarPropertiesUpdate.js.map