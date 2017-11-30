import {Utils} from './Utils';
import {BVHJoint} from './BVHJoint';
import {BVHJointKeyframe} from './BVHJointKeyframe';

export class BVH
{
    priority: number;
    length: number;
    expressionName: string;
    inPoint: number;
    outPoint: number;
    loop: number;
    easeInTime: number;
    easeOutTime: number;
    handPose: number;
    jointCount: number;
    joints: BVHJoint[] = [];

    // Decodes the binary LL animation format into human-readable BVH.
    readFromBuffer(buf: Buffer, pos: number): number
    {
        const header1 = buf.readUInt16LE(pos);
        pos = pos + 2;
        const header2 = buf.readUInt16LE(pos);
        pos = pos + 2;
        if (header1 !== 1 || header2 !== 0)
        {
            console.error('BVH Decoder: invalid data');
            return 0;
        }
        this.priority = buf.readInt32LE(pos);
        pos = pos + 4;
        this.length = buf.readFloatLE(pos);
        pos = pos + 4;
        let result = Utils.BufferToString(buf, pos);
        pos += result.readLength;
        this.expressionName = result.result;
        this.inPoint = buf.readFloatLE(pos);
        pos += 4;
        this.outPoint = buf.readFloatLE(pos);
        pos += 4;
        this.loop = buf.readInt32LE(pos);
        pos += 4;
        this.easeInTime = buf.readFloatLE(pos);
        pos += 4;
        this.easeOutTime = buf.readFloatLE(pos);
        pos += 4;
        this.handPose = buf.readUInt32LE(pos);
        pos += 4;
        this.jointCount = buf.readUInt32LE(pos);
        pos += 4;

        for (let x = 0; x < this.jointCount; x++)
        {
            const joint = new BVHJoint();
            pos = joint.readFromBuffer(buf, pos, this.inPoint, this.outPoint);
            this.joints.push(joint);
        }
        return pos;
    }
}