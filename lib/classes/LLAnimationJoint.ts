import { LLAnimationJointKeyFrame } from "./LLAnimationJointKeyFrame";
import type { BinaryReader } from './BinaryReader';
import { Utils } from "./Utils";
import { Vector3 } from './Vector3';
import type { BinaryWriter } from './BinaryWriter';

export class LLAnimationJoint
{
    public name: string;
    public priority: number;

    public rotationKeyframeCount: number;
    public rotationKeyframes: LLAnimationJointKeyFrame[] = [];

    public positionKeyframeCount: number;
    public positionKeyframes: LLAnimationJointKeyFrame[] = [];


    public readFromBuffer(buf: BinaryReader, inPoint: number, outPoint: number): void
    {
        this.name = buf.readCString();
        this.priority = buf.readInt32LE();
        this.rotationKeyframeCount = buf.readInt32LE();

        for (let frameNum = 0; frameNum < this.rotationKeyframeCount; frameNum++)
        {
            const jointKF = new LLAnimationJointKeyFrame();
            jointKF.time = Utils.UInt16ToFloat(buf.readUInt16LE(), inPoint, outPoint);
            const x = Utils.UInt16ToFloat(buf.readUInt16LE(), -1.0, 1.0);
            const y = Utils.UInt16ToFloat(buf.readUInt16LE(), -1.0, 1.0);
            const z = Utils.UInt16ToFloat(buf.readUInt16LE(), -1.0, 1.0);
            jointKF.transform = new Vector3([x, y, z]);
            this.rotationKeyframes.push(jointKF);
        }

        this.positionKeyframeCount = buf.readInt32LE();

        for (let frameNum = 0; frameNum < this.positionKeyframeCount; frameNum++)
        {
            const jointKF = new LLAnimationJointKeyFrame();
            jointKF.time = Utils.UInt16ToFloat(buf.readUInt16LE(), inPoint, outPoint);
            const x = Utils.UInt16ToFloat(buf.readUInt16LE(), -1.0, 1.0);
            const y = Utils.UInt16ToFloat(buf.readUInt16LE(), -1.0, 1.0);
            const z = Utils.UInt16ToFloat(buf.readUInt16LE(), -1.0, 1.0);
            jointKF.transform = new Vector3([x, y, z]);
            this.positionKeyframes.push(jointKF);
        }
    }

    public writeToBuffer(writer: BinaryWriter, inPoint: number, outPoint: number): void
    {
        writer.writeCString(this.name);
        writer.writeInt32LE(this.priority);
        writer.writeInt32LE(this.rotationKeyframeCount);
        for (const keyframe of this.rotationKeyframes)
        {
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.time, inPoint, outPoint));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.x, -1.0, 1.0));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.y, -1.0, 1.0));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.z, -1.0, 1.0));
        }

        writer.writeInt32LE(this.positionKeyframeCount);
        for (const keyframe of this.positionKeyframes)
        {
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.time, inPoint, outPoint));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.x, -1.0, 1.0));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.y, -1.0, 1.0));
            writer.writeUInt16LE(Utils.FloatToUInt16(keyframe.transform.z, -1.0, 1.0));
        }
    }
}
