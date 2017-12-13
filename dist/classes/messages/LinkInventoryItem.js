"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class LinkInventoryItemMessage {
    constructor() {
        this.name = 'LinkInventoryItem';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.LinkInventoryItem;
    }
    getSize() {
        return (this.InventoryBlock['Name'].length + 1 + this.InventoryBlock['Description'].length + 1) + 86;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.InventoryBlock['CallbackID'], pos);
        pos += 4;
        this.InventoryBlock['FolderID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryBlock['TransactionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.InventoryBlock['OldItemID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeInt8(this.InventoryBlock['Type'], pos++);
        buf.writeInt8(this.InventoryBlock['InvType'], pos++);
        buf.writeUInt8(this.InventoryBlock['Name'].length, pos++);
        this.InventoryBlock['Name'].copy(buf, pos);
        pos += this.InventoryBlock['Name'].length;
        buf.writeUInt8(this.InventoryBlock['Description'].length, pos++);
        this.InventoryBlock['Description'].copy(buf, pos);
        pos += this.InventoryBlock['Description'].length;
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
        const newObjInventoryBlock = {
            CallbackID: 0,
            FolderID: UUID_1.UUID.zero(),
            TransactionID: UUID_1.UUID.zero(),
            OldItemID: UUID_1.UUID.zero(),
            Type: 0,
            InvType: 0,
            Name: Buffer.allocUnsafe(0),
            Description: Buffer.allocUnsafe(0)
        };
        newObjInventoryBlock['CallbackID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjInventoryBlock['FolderID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryBlock['TransactionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryBlock['OldItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryBlock['Type'] = buf.readInt8(pos++);
        newObjInventoryBlock['InvType'] = buf.readInt8(pos++);
        varLength = buf.readUInt8(pos++);
        newObjInventoryBlock['Name'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        varLength = buf.readUInt8(pos++);
        newObjInventoryBlock['Description'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.InventoryBlock = newObjInventoryBlock;
        return pos - startPos;
    }
}
exports.LinkInventoryItemMessage = LinkInventoryItemMessage;
//# sourceMappingURL=LinkInventoryItem.js.map