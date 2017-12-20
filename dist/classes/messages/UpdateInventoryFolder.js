"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class UpdateInventoryFolderMessage {
    constructor() {
        this.name = 'UpdateInventoryFolder';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.UpdateInventoryFolder;
    }
    getSize() {
        return this.calculateVarVarSize(this.FolderData, 'Name', 1) + ((33) * this.FolderData.length) + 33;
    }
    calculateVarVarSize(block, paramName, extraPerVar) {
        let size = 0;
        block.forEach((bl) => {
            size += bl[paramName].length + extraPerVar;
        });
        return size;
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
            this.FolderData[i]['ParentID'].writeToBuffer(buf, pos);
            pos += 16;
            buf.writeInt8(this.FolderData[i]['Type'], pos++);
            buf.writeUInt8(this.FolderData[i]['Name'].length, pos++);
            this.FolderData[i]['Name'].copy(buf, pos);
            pos += this.FolderData[i]['Name'].length;
        }
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
        const count = buf.readUInt8(pos++);
        this.FolderData = [];
        for (let i = 0; i < count; i++) {
            const newObjFolderData = {
                FolderID: UUID_1.UUID.zero(),
                ParentID: UUID_1.UUID.zero(),
                Type: 0,
                Name: Buffer.allocUnsafe(0)
            };
            newObjFolderData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjFolderData['ParentID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjFolderData['Type'] = buf.readInt8(pos++);
            varLength = buf.readUInt8(pos++);
            newObjFolderData['Name'] = buf.slice(pos, pos + varLength);
            pos += varLength;
            this.FolderData.push(newObjFolderData);
        }
        return pos - startPos;
    }
}
exports.UpdateInventoryFolderMessage = UpdateInventoryFolderMessage;
//# sourceMappingURL=UpdateInventoryFolder.js.map