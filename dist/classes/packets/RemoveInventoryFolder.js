"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RemoveInventoryFolderPacket {
    constructor() {
        this.name = 'RemoveInventoryFolder';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902036;
    }
    getSize() {
        return ((16) * this.FolderData.length) + 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.FolderData.length;
        buf.writeUInt8(this.FolderData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.FolderData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
        }
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
        const count = buf.readUInt8(pos++);
        this.FolderData = [];
        for (let i = 0; i < count; i++) {
            const newObjFolderData = {
                FolderID: UUID_1.UUID.zero()
            };
            newObjFolderData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.FolderData.push(newObjFolderData);
        }
        return pos - startPos;
    }
}
exports.RemoveInventoryFolderPacket = RemoveInventoryFolderPacket;
//# sourceMappingURL=RemoveInventoryFolder.js.map