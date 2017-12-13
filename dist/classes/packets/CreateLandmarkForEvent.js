"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class CreateLandmarkForEventPacket {
    constructor() {
        this.name = 'CreateLandmarkForEvent';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902066;
    }
    getSize() {
        return (this.InventoryBlock['Name'].length + 1) + 52;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.EventData['EventID'], pos);
        pos += 4;
        this.InventoryBlock['FolderID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.write(this.InventoryBlock['Name'], pos);
        pos += this.InventoryBlock['Name'].length;
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
        const newObjEventData = {
            EventID: 0
        };
        newObjEventData['EventID'] = buf.readUInt32LE(pos);
        pos += 4;
        this.EventData = newObjEventData;
        const newObjInventoryBlock = {
            FolderID: UUID_1.UUID.zero(),
            Name: ''
        };
        newObjInventoryBlock['FolderID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjInventoryBlock['Name'] = buf.toString('utf8', pos, length);
        pos += length;
        this.InventoryBlock = newObjInventoryBlock;
        return pos - startPos;
    }
}
exports.CreateLandmarkForEventPacket = CreateLandmarkForEventPacket;
//# sourceMappingURL=CreateLandmarkForEvent.js.map