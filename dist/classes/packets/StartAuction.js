"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class StartAuctionPacket {
    constructor() {
        this.name = 'StartAuction';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901989;
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
        buf.write(this.ParcelData['Name'], pos);
        pos += this.ParcelData['Name'].length;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjParcelData = {
            ParcelID: UUID_1.UUID.zero(),
            SnapshotID: UUID_1.UUID.zero(),
            Name: ''
        };
        newObjParcelData['ParcelID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['SnapshotID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjParcelData['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        this.ParcelData = newObjParcelData;
        return pos - startPos;
    }
}
exports.StartAuctionPacket = StartAuctionPacket;
//# sourceMappingURL=StartAuction.js.map