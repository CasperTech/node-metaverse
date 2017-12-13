"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
const Vector3_1 = require("./Vector3");
const BVHJointKeyframe_1 = require("./BVHJointKeyframe");
class BVHJoint {
    constructor() {
        this.rotationKeyframes = [];
        this.positionKeyframes = [];
    }
    readFromBuffer(buf, pos, inPoint, outPoint) {
        const result = Utils_1.Utils.BufferToString(buf, pos);
        pos += result.readLength;
        this.name = result.result;
        this.priority = buf.readInt32LE(pos);
        pos = pos + 4;
        this.rotationKeyframeCount = buf.readInt32LE(pos);
        pos = pos + 4;
        for (let x = 0; x < this.rotationKeyframeCount; x++) {
            const jointKF = new BVHJointKeyframe_1.BVHJointKeyframe();
            jointKF.time = Utils_1.Utils.UInt16ToFloat(buf.readUInt16LE(pos), inPoint, outPoint);
            pos = pos + 2;
            const x = Utils_1.Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            const y = Utils_1.Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            const z = Utils_1.Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            jointKF.transform = new Vector3_1.Vector3([x, y, z]);
            this.rotationKeyframes.push(jointKF);
        }
        this.positionKeyframeCount = buf.readInt32LE(pos);
        pos = pos + 4;
        for (let x = 0; x < this.positionKeyframeCount; x++) {
            const jointKF = new BVHJointKeyframe_1.BVHJointKeyframe();
            jointKF.time = Utils_1.Utils.UInt16ToFloat(buf.readUInt16LE(pos), inPoint, outPoint);
            pos = pos + 2;
            const x = Utils_1.Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            const y = Utils_1.Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            const z = Utils_1.Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            jointKF.transform = new Vector3_1.Vector3([x, y, z]);
            this.positionKeyframes.push(jointKF);
        }
        return pos;
    }
}
exports.BVHJoint = BVHJoint;
//# sourceMappingURL=BVHJoint.js.map