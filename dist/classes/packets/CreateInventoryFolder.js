"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class CreateInventoryFolderPacket {
    constructor() {
        this.name = 'CreateInventoryFolder';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902033;
    }
    getSize() {
        return (this.FolderData['Name'].length + 1) + 65;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.FolderData['FolderID'].writeToBuffer(buf, pos);
        pos += 16;
        this.FolderData['ParentID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt8(this.FolderData['Type'], pos++);
        buf.write(this.FolderData['Name'], pos);
        pos += this.FolderData['Name'].length;
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
        const newObjFolderData = {
            FolderID: UUID_1.UUID.zero(),
            ParentID: UUID_1.UUID.zero(),
            Type: 0,
            Name: ''
        };
        newObjFolderData['FolderID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjFolderData['ParentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjFolderData['Type'] = buf.readInt8(pos++);
        newObjFolderData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        this.FolderData = newObjFolderData;
        return pos - startPos;
    }
}
exports.CreateInventoryFolderPacket = CreateInventoryFolderPacket;
//# sourceMappingURL=CreateInventoryFolder.js.map