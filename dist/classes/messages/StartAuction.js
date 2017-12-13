"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class StartAuctionMessage {
    constructor() {
        this.name = 'StartAuction';
        this.messageFlags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = Message_1.Message.StartAuction;
    }
    getSize() {
        return (this.ParcelData['Name'].length + 1) + 48;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ParcelData['ParcelID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ParcelData['SnapshotID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ParcelData['Name'].length, pos++);
        this.ParcelData['Name'].copy(buf, pos);
        pos += this.ParcelData['Name'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjParcelData = {
            ParcelID: UUID_1.UUID.zero(),
            SnapshotID: UUID_1.UUID.zero(),
            Name: Buffer.allocUnsafe(0)
        };
        newObjParcelData['ParcelID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['SnapshotID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        varLength = buf.readUInt8(pos++);
        newObjParcelData['Name'] = buf.slice(pos, pos + varLength);
        pos += varLength;
        this.ParcelData = newObjParcelData;
        return pos - startPos;
    }
}
exports.StartAuctionMessage = StartAuctionMessage;
//# sourceMappingURL=StartAuction.js.map