import {Utils} from './Utils';
import {Vector3} from './Vector3';
import {BVHJointKeyframe} from './BVHJointKeyframe';

export class BVHJoint
{
    name: string;
    priority: number;

    rotationKeyframeCount: number;
    rotationKeyframes: BVHJointKeyframe[] = [];

    positionKeyframeCount: number;
    positionKeyframes: BVHJointKeyframe[] = [];


    readFromBuffer(buf: Buffer, pos: number, inPoint: number, outPoint: number): number
    {
        const result = Utils.BufferToString(buf, pos);
        pos += result.readLength;
        this.name = result.result;

        this.priority = buf.readInt32LE(pos);
        pos = pos + 4;
        this.rotationKeyframeCount = buf.readInt32LE(pos);
        pos = pos + 4;

        for (let x = 0; x < this.rotationKeyframeCount; x++)
        {
            const jointKF = new BVHJointKeyframe();
            jointKF.time = Utils.UInt16ToFloat(buf.readUInt16LE(pos), inPoint, outPoint);
            pos = pos + 2;
            const x = Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            const y = Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            const z = Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            jointKF.transform = new Vector3([x, y, z]);
            this.rotationKeyframes.push(jointKF);
        }

        this.positionKeyframeCount = buf.readInt32LE(pos);
        pos = pos + 4;

        for (let x = 0; x < this.positionKeyframeCount; x++)
        {
            const jointKF = new BVHJointKeyframe();
            jointKF.time = Utils.UInt16ToFloat(buf.readUInt16LE(pos), inPoint, outPoint);
            pos = pos + 2;
            const x = Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            const y = Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            const z = Utils.UInt16ToFloat(buf.readUInt16LE(pos), -1.0, 1.0);
            pos = pos + 2;
            jointKF.transform = new Vector3([x, y, z]);
            this.positionKeyframes.push(jointKF);
        }
        return pos;
    }
}