"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class UpdateUserInfoPacket {
    constructor() {
        this.name = 'UpdateUserInfo';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902161;
    }
    getSize() {
        return (this.UserData['DirectoryVisibility'].length + 1) + 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.UserData['IMViaEMail']) ? 1 : 0, pos++);
        buf.write(this.UserData['DirectoryVisibility'], pos);
        pos += this.UserData['DirectoryVisibility'].length;
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
        const newObjUserData = {
            IMViaEMail: false,
            DirectoryVisibility: ''
        };
        newObjUserData['IMViaEMail'] = (buf.readUInt8(pos++) === 1);
        newObjUserData['DirectoryVisibility'] = buf.toString('utf8', pos, length);
        pos += length;
        this.UserData = newObjUserData;
        return pos - startPos;
    }
}
exports.UpdateUserInfoPacket = UpdateUserInfoPacket;
//# sourceMappingURL=UpdateUserInfo.js.map