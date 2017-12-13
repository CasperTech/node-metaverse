"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("../UUID");
const Vector3_1 = require("../Vector3");
const MessageFlags_1 = require("../../enums/MessageFlags");
class ObjectGrabUpdatePacket {
    constructor() {
        this.name = 'ObjectGrabUpdate';
        this.flags = MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyLow;
        this.id = 4294901878;
    }
    getSize() {
        return ((64) * this.SurfaceInfo.length) + 77;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.AgentData['AgentID'].writeToBuffer(buf, pos);
        pos += 16;
        this.AgentData['SessionID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ObjectData['ObjectID'].writeToBuffer(buf, pos);
        pos += 16;
        this.ObjectData['GrabOffsetInitial'].writeToBuffer(buf, pos, false);
        pos += 12;
        this.ObjectData['GrabPosition'].writeToBuffer(buf, pos, false);
        pos += 12;
        buf.writeUInt32LE(this.ObjectData['TimeSinceLast'], pos);
        pos += 4;
        const count = this.SurfaceInfo.length;
        buf.writeUInt8(this.SurfaceInfo.length, pos++);
        for (let i = 0; i < count; i++) {
            this.SurfaceInfo[i]['UVCoord'].writeToBuffer(buf, pos, false);
            pos += 12;
            this.SurfaceInfo[i]['STCoord'].writeToBuffer(buf, pos, false);
            pos += 12;
            buf.writeInt32LE(this.SurfaceInfo[i]['FaceIndex'], pos);
            pos += 4;
            this.SurfaceInfo[i]['Position'].writeToBuffer(buf, pos, false);
            pos += 12;
            this.SurfaceInfo[i]['Normal'].writeToBuffer(buf, pos, false);
            pos += 12;
            this.SurfaceInfo[i]['Binormal'].writeToBuffer(buf, pos, false);
            pos += 12;
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
        const newObjObjectData = {
            ObjectID: UUID_1.UUID.zero(),
            GrabOffsetInitial: Vector3_1.Vector3.getZero(),
            GrabPosition: Vector3_1.Vector3.getZero(),
            TimeSinceLast: 0
        };
        newObjObjectData['ObjectID'] = new UUID_1.UUID(buf, pos);
        pos += 16;
        newObjObjectData['GrabOffsetInitial'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjObjectData['GrabPosition'] = new Vector3_1.Vector3(buf, pos, false);
        pos += 12;
        newObjObjectData['TimeSinceLast'] = buf.readUInt32LE(pos);
        pos += 4;
        this.ObjectData = newObjObjectData;
        const count = buf.readUInt8(pos++);
        this.SurfaceInfo = [];
        for (let i = 0; i < count; i++) {
            const newObjSurfaceInfo = {
                UVCoord: Vector3_1.Vector3.getZero(),
                STCoord: Vector3_1.Vector3.getZero(),
                FaceIndex: 0,
                Position: Vector3_1.Vector3.getZero(),
                Normal: Vector3_1.Vector3.getZero(),
                Binormal: Vector3_1.Vector3.getZero()
            };
            newObjSurfaceInfo['UVCoord'] = new Vector3_1.Vector3(buf, pos, false);
            pos += 12;
            newObjSurfaceInfo['STCoord'] = new Vector3_1.Vector3(buf, pos, false);
            pos += 12;
            newObjSurfaceInfo['FaceIndex'] = buf.readInt32LE(pos);
            pos += 4;
            newObjSurfaceInfo['Position'] = new Vector3_1.Vector3(buf, pos, false);
            pos += 12;
            newObjSurfaceInfo['Normal'] = new Vector3_1.Vector3(buf, pos, false);
            pos += 12;
            newObjSurfaceInfo['Binormal'] = new Vector3_1.Vector3(buf, pos, false);
            pos += 12;
            this.SurfaceInfo.push(newObjSurfaceInfo);
        }
        return pos - startPos;
    }
}
exports.ObjectGrabUpdatePacket = ObjectGrabUpdatePacket;
//# sourceMappingURL=ObjectGrabUpdate.js.map