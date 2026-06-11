import { LLAnimationJointKeyFrame } from './LLAnimationJointKeyFrame';
import type { BinaryReader } from './BinaryReader';
import { Utils } from './Utils';
import { Vector3 } from './Vector3';
import { Quaternion } from './Quaternion';
import type { BinaryWriter } from './BinaryWriter';

const LL_MAX_PELVIS_OFFSET = 5.0;

export class LLAnimationJoint
{
    public name: string;
    public priority: number;

    public rotationKeyframeCount: number;
    public rotationKeyframes: LLAnimationJointKeyFrame[] = [];

    public positionKeyframeCount: number;
    public positionKeyframes: LLAnimationJointKeyFrame[] = [];


    public readFromBuffer(buf: BinaryReader, duration: number): void
    {
        this.name = buf.readCString();
        this.priority = buf.readInt32LE();
        this.rotationKeyframeCount = buf.readInt32LE();

        for (let frameNum = 0; frameNum < this.rotationKeyframeCount; frameNum++)
        {
            const jointKF = new LLAnimationJointKeyFrame();
            jointKF.time = Utils.UInt16ToFloat(buf.readUInt16LE(), 0.0, duration, false);
            const x = Utils.UInt16ToFloat(buf.readUInt16LE(), -1.0, 1.0, false);
            const y = Utils.UInt16ToFloat(buf.readUInt16LE(), -1.0, 1.0, false);
            const z = Utils.UInt16ToFloat(buf.readUInt16LE(), -1.0, 1.0, false);
            const remainder = 1.0 - (x * x) - (y * y) - (z * z);
            const w = remainder > 0.0 ? Math.sqrt(remainder) : 0.0;
            jointKF.transform = new Quaternion([x, y, z, w]);
            this.rotationKeyframes.push(jointKF);
        }

        this.positionKeyframeCount = buf.readInt32LE();

        for (let frameNum = 0; frameNum < this.positionKeyframeCount; frameNum++)
        {
            const jointKF = new LLAnimationJointKeyFrame();
            jointKF.time = Utils.UInt16ToFloat(buf.readUInt16LE(), 0.0, duration, false);
            const x = Utils.UInt16ToFloat(buf.readUInt16LE(), -LL_MAX_PELVIS_OFFSET, LL_MAX_PELVIS_OFFSET, false);
            const y = Utils.UInt16ToFloat(buf.readUInt16LE(), -LL_MAX_PELVIS_OFFSET, LL_MAX_PELVIS_OFFSET, false);
            const z = Utils.UInt16ToFloat(buf.readUInt16LE(), -LL_MAX_PELVIS_OFFSET, LL_MAX_PELVIS_OFFSET, false);
            jointKF.transform = new Vector3([x, y, z]);
            this.positionKeyframes.push(jointKF);
        }
    }

    public writeToBuffer(writer: BinaryWriter, duration: number): void
    {
        writer.writeCString(this.name);
        writer.writeInt32LE(this.priority);
        writer.writeInt32LE(this.rotationKeyframes.length);
        for (const keyframe of this.rotationKeyframes)
        {
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.time, 0.0, duration));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.x, -1.0, 1.0));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.y, -1.0, 1.0));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.z, -1.0, 1.0));
        }

        writer.writeInt32LE(this.positionKeyframes.length);
        for (const keyframe of this.positionKeyframes)
        {
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.time, 0.0, duration));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.x, -LL_MAX_PELVIS_OFFSET, LL_MAX_PELVIS_OFFSET));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.y, -LL_MAX_PELVIS_OFFSET, LL_MAX_PELVIS_OFFSET));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.z, -LL_MAX_PELVIS_OFFSET, LL_MAX_PELVIS_OFFSET));
        }
    }
}
