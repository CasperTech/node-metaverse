"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class RezObjectFromNotecardPacket {
    constructor() {
        this.name = 'RezObjectFromNotecard';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294902054;
    }
    getSize() {
        return ((16) * this.InventoryData.length) + 157;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        this.RezData['FromTaskID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.RezData['BypassRaycast'], pos++);
        this.RezData['RayStart'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.RezData['RayEnd'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.RezData['RayTargetID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8((this.RezData['RayEndIsIntersection']) ? 1 : 0, pos++);
        buf.writeUInt8((this.RezData['RezSelected']) ? 1 : 0, pos++);
        buf.writeUInt8((this.RezData['RemoveItem']) ? 1 : 0, pos++);
        buf.writeUInt32LE(this.RezData['ItemFlags'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RezData['GroupMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RezData['EveryoneMask'], pos);
        pos += 4;
        buf.writeUInt32LE(this.RezData['NextOwnerMask'], pos);
        pos += 4;
        this.NotecardData['NotecardItemID'].writeToBuffer(buf, pos);
        pos += 16;
        this.NotecardData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.InventoryData.length;
        buf.writeUInt8(this.InventoryData.length, pos++);
        for (let i = 0; i < count; i++) {
            this.InventoryData[i]['ItemID'].writeToBuffer(buf, pos);
            pos += 16;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero()
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.AgentData = newObjAgentData;
        const newObjRezData = {
            FromTaskID: UUID_1.UUID.zero(),
            BypassRaycast: 0,
            RayStart: Vector3_1.Vector3.getZero(),
            RayEnd: Vector3_1.Vector3.getZero(),
            RayTargetID: UUID_1.UUID.zero(),
            RayEndIsIntersection: false,
            RezSelected: false,
            RemoveItem: false,
            ItemFlags: 0,
            GroupMask: 0,
            EveryoneMask: 0,
            NextOwnerMask: 0
        };
        newObjRezData['FromTaskID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRezData['BypassRaycast'] = buf.readUInt8(pos++);
        newObjRezData['RayStart'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjRezData['RayEnd'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjRezData['RayTargetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjRezData['RayEndIsIntersection'] = (buf.readUInt8(pos++) === 1);
        newObjRezData['RezSelected'] = (buf.readUInt8(pos++) === 1);
        newObjRezData['RemoveItem'] = (buf.readUInt8(pos++) === 1);
        newObjRezData['ItemFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRezData['GroupMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRezData['EveryoneMask'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjRezData['NextOwnerMask'] = buf.readUInt32LE(pos);
        pos += 4;
        this.RezData = newObjRezData;
        const newObjNotecardData = {
            NotecardItemID: UUID_1.UUID.zero(),
            ObjectID: UUID_1.UUID.zero()
        };
        newObjNotecardData['NotecardItemID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjNotecardData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.NotecardData = newObjNotecardData;
        const count = buf.readUInt8(pos++);
        this.InventoryData = [];
        for (let i = 0; i < count; i++) {
            const newObjInventoryData = {
                ItemID: UUID_1.UUID.zero()
            };
            newObjInventoryData['ItemID'] = new UUID_1.UUID(buf, pos);
            pos += 16;
            this.InventoryData.push(newObjInventoryData);
        }
        return pos - startPos;
    }
}
exports.RezObjectFromNotecardPacket = RezObjectFromNotecardPacket;
//# sourceMappingURL=RezObjectFromNotecard.js.map