"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Long = require("long");
const MessageFlags_1 = require("../../enums/MessageFlags");
class MapItemRequestPacket {
    constructor() {
        this.name = 'MapItemRequest';
        this.flags = MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902170;
    }
    getSize() {
        return 53;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['Flags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.AgentData['EstateID'], pos);
        pos += 4;
        buf.writeUInt8((this.AgentData['Godlike']) ? 1 : 0, pos++);
        buf.writeUInt32LE(this.RequestData['ItemType'], pos);
        pos += 4;
        buf.writeInt32LE(this.RequestData['RegionHandle'].low, pos);
        pos += 4;
        buf.writeInt32LE(this.RequestData['RegionHandle'].high, pos);
        pos += 4;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            Flags: 0,
            EstateID: 0,
            Godlike: false
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['Flags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['EstateID'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjAgentData['Godlike'] = (buf.readUInt8(pos++) === 1);
        this.AgentData = newObjAgentData;
        const newObjRequestData = {
            ItemType: 0,
            RegionHandle: Long.ZERO
        };
        newObjRequestData['ItemType'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRequestData['RegionHandle'] = new Long(buf.readInt32LE(pos), buf.readInt32LE(pos + 4));
        pos += 8;
        this.RequestData = newObjRequestData;
        return pos - startPos;
    }
}
exports.MapItemRequestPacket = MapItemRequestPacket;
//# sourceMappingURL=MapItemRequest.js.map