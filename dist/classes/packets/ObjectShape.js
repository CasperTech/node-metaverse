"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ObjectShapePacket {
    constructor() {
        this.name = 'ObjectShape';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901858;
    }
    getSize() {
        return ((27) * this.ObjectData.length) + 33;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        const count = this.ObjectData.length;
        buf.writeUInt8(this.ObjectData.length, pos++);
        for (let i = 0; i < count; i++) {
            buf.writeUInt32LE(this.ObjectData[i]['ObjectLocalID'], pos);
            pos += 4;
            buf.writeUInt8(this.ObjectData[i]['PathCurve'], pos++);
            buf.writeUInt8(this.ObjectData[i]['ProfileCurve'], pos++);
            buf.writeUInt16LE(this.ObjectData[i]['PathBegin'], pos);
            pos += 2;
            buf.writeUInt16LE(this.ObjectData[i]['PathEnd'], pos);
            pos += 2;
            buf.writeUInt8(this.ObjectData[i]['PathScaleX'], pos++);
            buf.writeUInt8(this.ObjectData[i]['PathScaleY'], pos++);
            buf.writeUInt8(this.ObjectData[i]['PathShearX'], pos++);
            buf.writeUInt8(this.ObjectData[i]['PathShearY'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathTwist'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathTwistBegin'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathRadiusOffset'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathTaperX'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathTaperY'], pos++);
            buf.writeUInt8(this.ObjectData[i]['PathRevolutions'], pos++);
            buf.writeInt8(this.ObjectData[i]['PathSkew'], pos++);
            buf.writeUInt16LE(this.ObjectData[i]['ProfileBegin'], pos);
            pos += 2;
            buf.writeUInt16LE(this.ObjectData[i]['ProfileEnd'], pos);
            pos += 2;
            buf.writeUInt16LE(this.ObjectData[i]['ProfileHollow'], pos);
            pos += 2;
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
        const count = buf.readUInt8(pos++);
        this.ObjectData = [];
        for (let i = 0; i < count; i++) {
            const newObjObjectData = {
                ObjectLocalID: 0,
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
                ProfileHollow: 0
            };
            newObjObjectData['ObjectLocalID'] = buf.readUInt32LE(pos);
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
            this.ObjectData.push(newObjObjectData);
        }
        return pos - startPos;
    }
}
exports.ObjectShapePacket = ObjectShapePacket;
//# sourceMappingURL=ObjectShape.js.map