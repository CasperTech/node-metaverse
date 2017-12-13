"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const Quaternion_1 = require("../Quaternion");
const MessageFlags_1 = require("../../enums/MessageFlags");
const Message_1 = require("../../enums/Message");
class ObjectAddMessage {
    constructor() {
        this.name = 'ObjectAdd';
        this.messageFlags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyMedium;
        this.id = Message_1.Message.ObjectAdd;
    }
    getSize() {
        return 144;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['GroupID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ObjectData['PCode'], pos++);
        buf.writeUInt8(this.ObjectData['Material'], pos++);
        buf.writeUInt32LE(this.ObjectData['AddFlags'], pos);
        pos += 4;
        buf.writeUInt8(this.ObjectData['PathCurve'], pos++);
        buf.writeUInt8(this.ObjectData['ProfileCurve'], pos++);
        buf.writeUInt16LE(this.ObjectData['PathBegin'], pos);
        pos += 2;
        buf.writeUInt16LE(this.ObjectData['PathEnd'], pos);
        pos += 2;
        buf.writeUInt8(this.ObjectData['PathScaleX'], pos++);
        buf.writeUInt8(this.ObjectData['PathScaleY'], pos++);
        buf.writeUInt8(this.ObjectData['PathShearX'], pos++);
        buf.writeUInt8(this.ObjectData['PathShearY'], pos++);
        buf.writeInt8(this.ObjectData['PathTwist'], pos++);
        buf.writeInt8(this.ObjectData['PathTwistBegin'], pos++);
        buf.writeInt8(this.ObjectData['PathRadiusOffset'], pos++);
        buf.writeInt8(this.ObjectData['PathTaperX'], pos++);
        buf.writeInt8(this.ObjectData['PathTaperY'], pos++);
        buf.writeUInt8(this.ObjectData['PathRevolutions'], pos++);
        buf.writeInt8(this.ObjectData['PathSkew'], pos++);
        buf.writeUInt16LE(this.ObjectData['ProfileBegin'], pos);
        pos += 2;
        buf.writeUInt16LE(this.ObjectData['ProfileEnd'], pos);
        pos += 2;
        buf.writeUInt16LE(this.ObjectData['ProfileHollow'], pos);
        pos += 2;
        buf.writeUInt8(this.ObjectData['BypassRaycast'], pos++);
        this.ObjectData['RayStart'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ObjectData['RayEnd'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ObjectData['RayTargetID'].writeToBuffer(buf, pos);
        pos += 16;
        buf.writeUInt8(this.ObjectData['RayEndIsIntersection'], pos++);
        this.ObjectData['Scale'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ObjectData['Rotation'].writeToBuffer(buf, pos);
        pos += 12;
        buf.writeUInt8(this.ObjectData['State'], pos++);
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        let varLength = 0;
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
        const newObjObjectData = {
            PCode: 0,
            Material: 0,
            AddFlags: 0,
            PathCurve: 0,
            ProfileCurve: 0,
            PathBegin: 0,
            PathEnd: 0,
            PathScaleX: 0,
            PathScaleY: 0,
            PathShearX: 0,
            PathShearY: 0,
            PathTwist: 0,
            PathTwistBegin: 0,
            PathRadiusOffset: 0,
            PathTaperX: 0,
            PathTaperY: 0,
            PathRevolutions: 0,
            PathSkew: 0,
            ProfileBegin: 0,
            ProfileEnd: 0,
            ProfileHollow: 0,
            BypassRaycast: 0,
            RayStart: Vector3_1.Vector3.getZero(),
            RayEnd: Vector3_1.Vector3.getZero(),
            RayTargetID: UUID_1.UUID.zero(),
            RayEndIsIntersection: 0,
            Scale: Vector3_1.Vector3.getZero(),
            Rotation: Quaternion_1.Quaternion.getIdentity(),
            State: 0
        };
        newObjObjectData['PCode'] = buf.readUInt8(pos++);
        newObjObjectData['Material'] = buf.readUInt8(pos++);
        newObjObjectData['AddFlags'] = buf.readUInt32LE(pos);
        pos += 4;
        newObjObjectData['PathCurve'] = buf.readUInt8(pos++);
        newObjObjectData['ProfileCurve'] = buf.readUInt8(pos++);
        newObjObjectData['PathBegin'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjObjectData['PathEnd'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjObjectData['PathScaleX'] = buf.readUInt8(pos++);
        newObjObjectData['PathScaleY'] = buf.readUInt8(pos++);
        newObjObjectData['PathShearX'] = buf.readUInt8(pos++);
        newObjObjectData['PathShearY'] = buf.readUInt8(pos++);
        newObjObjectData['PathTwist'] = buf.readInt8(pos++);
        newObjObjectData['PathTwistBegin'] = buf.readInt8(pos++);
        newObjObjectData['PathRadiusOffset'] = buf.readInt8(pos++);
        newObjObjectData['PathTaperX'] = buf.readInt8(pos++);
        newObjObjectData['PathTaperY'] = buf.readInt8(pos++);
        newObjObjectData['PathRevolutions'] = buf.readUInt8(pos++);
        newObjObjectData['PathSkew'] = buf.readInt8(pos++);
        newObjObjectData['ProfileBegin'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjObjectData['ProfileEnd'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjObjectData['ProfileHollow'] = buf.readUInt16LE(pos);
        pos += 2;
        newObjObjectData['BypassRaycast'] = buf.readUInt8(pos++);
        newObjObjectData['RayStart'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjObjectData['RayEnd'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjObjectData['RayTargetID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjObjectData['RayEndIsIntersection'] = buf.readUInt8(pos++);
        newObjObjectData['Scale'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjObjectData['Rotation'] = new Quaternion_1.Quaternion(buf, pos);
        pos += 12;
        newObjObjectData['State'] = buf.readUInt8(pos++);
        this.ObjectData = newObjObjectData;
        return pos - startPos;
    }
}
exports.ObjectAddMessage = ObjectAddMessage;
//# sourceMappingURL=ObjectAdd.js.map