"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class RemoveInventoryObjectsMessage {
    constructor() {
        this.name = 'RemoveInventoryObjects';
        this.messageFlags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.RemoveInventoryObjects;
    }
    getSize() {
        return ((16) * this.FolderData.length) + ((16) * this.ItemData.length) + 34;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        let count = this.FolderData.length;
        buf.writeUInt8(this.FolderData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.FolderData[i]['FolderID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        count = this.ItemData.length;
        buf.writeUInt8(this.ItemData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ItemData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
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
        let count = buf.readUInt8(pos++);
        this.FolderData = [];
        for (let i = 0; i < count; i++) {
            const newObjFolderData = {
                FolderID: UUID_1.UUID.zero()
            };
            newObjFolderData['FolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.FolderData.push(newObjFolderData);
        }
        count = buf.readUInt8(pos++);
        this.ItemData = [];
        for (let i = 0; i < count; i++) {
            const newObjItemData = {
                ItemID: UUID_1.UUID.zero()
            };
            newObjItemData['ItemID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.ItemData.push(newObjItemData);
        }
        return pos - startPos;
    }
}
exports.RemoveInventoryObjectsMessage = RemoveInventoryObjectsMessage;
//# sourceMappingURL=RemoveInventoryObjects.js.map