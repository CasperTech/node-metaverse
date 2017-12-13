"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class CreateNewOutfitAttachmentsPacket {
    constructor() {
        this.name = 'CreateNewOutfitAttachments';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902158;
    }
    getSize() {
        return ((32) * this.ObjectData.length) + 49;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.HeaderData['NewFolderID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.ObjectData[i]['OldItemID'].writeToBuffer(buf, pos);
            pos += 16;
            this.ObjectData[i]['OldFolderID'].writeToBuffer(buf, pos);
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
        const newObjHeaderData = {
            NewFolderID: UUID_1.UUID.zero()
        };
        newObjHeaderData['NewFolderID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.HeaderData = newObjHeaderData;
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++) {
            const newObjObjectData = {
                OldItemID: UUID_1.UUID.zero(),
                OldFolderID: UUID_1.UUID.zero()
            };
            newObjObjectData['OldItemID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            newObjObjectData['OldFolderID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.CreateNewOutfitAttachmentsPacket = CreateNewOutfitAttachmentsPacket;
//# sourceMappingURL=CreateNewOutfitAttachments.js.map