"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ParcelBuyPacket {
    constructor() {
        this.name = 'ParcelBuy';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901973;
    }
    getSize() {
        return 63;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.Data['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.Data['IsGroupOwned']) ? 1 : 0, pos++);
        buf.writeUInt8((this.Data['RemoveContribution']) ? 1 : 0, pos++);
        buf.writeInt32LE(this.Data['LocalID'], pos);
        pos += 4;
        buf.writeUInt8((this.Data['Final']) ? 1 : 0, pos++);
        buf.writeInt32LE(this.ParcelData['Price'], pos);
        pos += 4;
        buf.writeInt32LE(this.ParcelData['Area'], pos);
        pos += 4;
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
        const newObjData = {
            GroupID: UUID_1.UUID.zero(),
            IsGroupOwned: false,
            RemoveContribution: false,
            LocalID: 0,
            Final: false
        };
        newObjData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjData['IsGroupOwned'] = (buf.readUInt8(pos++) === 1);
        newObjData['RemoveContribution'] = (buf.readUInt8(pos++) === 1);
        newObjData['LocalID'] = buf.readInt32LE(pos);
        pos += 4;
        newObjData['Final'] = (buf.readUInt8(pos++) === 1);
        this.Data = newObjData;
        const newObjParcelData = {
            Price: 0,
            Area: 0
        };
        newObjParcelData['Price'] = buf.readInt32LE(pos);
        pos += 4;
        newObjParcelData['Area'] = buf.readInt32LE(pos);
        pos += 4;
        this.ParcelData = newObjParcelData;
        return pos - startPos;
    }
}
exports.ParcelBuyPacket = ParcelBuyPacket;
//# sourceMappingURL=ParcelBuy.js.map