"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ObjectDuplicateOnRayPacket {
    constructor() {
        this.name = 'ObjectDuplicateOnRay';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901851;
    }
    getSize() {
        return ((4) * this.ObjectData.length) + 97;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['RayStart'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.AgentData['RayEnd'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt8((this.AgentData['BypassRaycast']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AgentData['RayEndIsIntersection']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AgentData['CopyCenters']) ? 1 : 0, pos++);
        buf.writeUInt8((this.AgentData['CopyRotates']) ? 1 : 0, pos++);
        this.AgentData['RayTargetID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt32LE(this.AgentData['DuplicateFlags'], pos);
        pos += 4;
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.ObjectData[i]['ObjectLocalID'], pos);
            pos += 4;
        }
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjAgentData = {
            AgentID: UUID_1.UUID.zero(),
            SessionID: UUID_1.UUID.zero(),
            GroupID: UUID_1.UUID.zero(),
            RayStart: Vector3_1.Vector3.getZero(),
            RayEnd: Vector3_1.Vector3.getZero(),
            BypassRaycast: false,
            RayEndIsIntersection: false,
            CopyCenters: false,
            CopyRotates: false,
            RayTargetID: UUID_1.UUID.zero(),
            DuplicateFlags: 0
        };
        newObjAgentData['AgentID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['SessionID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['GroupID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['RayStart'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['RayEnd'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjAgentData['BypassRaycast'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['RayEndIsIntersection'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['CopyCenters'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['CopyRotates'] = (buf.readUInt8(pos++) === 1);
        newObjAgentData['RayTargetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjAgentData['DuplicateFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        this.AgentData = newObjAgentData;
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++) {
            const newObjObjectData = {
                ObjectLocalID: 0
            };
            newObjObjectData['ObjectLocalID'] = buf.readUInt32LE(pos);
            pos += 4;
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.ObjectDuplicateOnRayPacket = ObjectDuplicateOnRayPacket;
//# sourceMappingURL=ObjectDuplicateOnRay.js.map