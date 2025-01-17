import { LLAnimationJoint } from './LLAnimationJoint';
import { Vector3 } from './Vector3';
import { BinaryReader } from './BinaryReader';
import { BinaryWriter } from './BinaryWriter';

export class LLAnimation
{
    public priority: number;
    public length: number;
    public expressionName: string;
    public inPoint: number;
    public outPoint: number;
    public loop: number;
    public easeInTime: number;
    public easeOutTime: number;
    public handPose: number;
    public jointCount: number;
    public joints: LLAnimationJoint[] = [];
    public constraints: {
        chainLength: number,
        constraintType: number,
        sourceVolume: string,
        sourceOffset: Vector3,
        targetVolume: string,
        targetOffset: Vector3,
        targetDir: Vector3,
        easeInStart: number,
        easeInStop: number,
        easeOutStart: number,
        easeOutStop: number
    }[];

    public constructor(buf?: Buffer)
    {
        if (buf)
        {
            const br = new BinaryReader(buf);
            this.readFromBuffer(br);
        }
    }

    public readFromBuffer(buf: BinaryReader): void
    {
        const header1 = buf.readUInt16LE();
        const header2 = buf.readUInt16LE();
        if (header1 !== 1 || header2 !== 0)
        {
            throw new Error('Invalid LLAnimation data');
        }
        this.priority = buf.readInt32LE();
        this.length = buf.readFloatLE();
        this.expressionName = buf.readCString();
        this.inPoint = buf.readFloatLE();
        this.outPoint = buf.readFloatLE();
        this.loop = buf.readInt32LE();
        this.easeInTime = buf.readFloatLE();
        this.easeOutTime = buf.readFloatLE();
        this.handPose = buf.readUInt32LE();
        this.jointCount = buf.readUInt32LE();

        for (let x = 0; x < this.jointCount; x++)
        {
            const joint = new LLAnimationJoint();
            joint.readFromBuffer(buf, this.inPoint, this.outPoint);
            this.joints.push(joint);
        }

        this.constraints = [];
        const numConstraints = buf.readInt32LE();
        for (let x = 0; x < numConstraints; x++)
        {
            this.constraints.push({
                chainLength: buf.readUInt8(),
                constraintType: buf.readUInt8(),
                sourceVolume: buf.readFixedString(16),
                sourceOffset: new Vector3(buf.readFloatLE(), buf.readFloatLE(), buf.readFloatLE()),
                targetVolume: buf.readFixedString(16),
                targetOffset: new Vector3(buf.readFloatLE(), buf.readFloatLE(), buf.readFloatLE()),
                targetDir: new Vector3(buf.readFloatLE(), buf.readFloatLE(), buf.readFloatLE()),
                easeInStart: buf.readFloatLE(),
                easeInStop: buf.readFloatLE(),
                easeOutStart: buf.readFloatLE(),
                easeOutStop: buf.readFloatLE()
            });
        }
    }

    public toAsset(): Buffer
    {
        const writer = new BinaryWriter();

        writer.writeUInt16LE(1);
        writer.writeUInt16LE(0);

        writer.writeInt32LE(this.priority);
        writer.writeFloatLE(this.length);
        writer.writeCString(this.expressionName);
        writer.writeFloatLE(this.inPoint);
        writer.writeFloatLE(this.outPoint);
        writer.writeInt32LE(this.loop);
        writer.writeFloatLE(this.easeInTime);
        writer.writeFloatLE(this.easeOutTime);
        writer.writeUInt32LE(this.handPose);
        writer.writeUInt32LE(this.jointCount);

        for (const joint of this.joints)
        {
            joint.writeToBuffer(writer, this.inPoint, this.outPoint);
        }

        writer.writeInt32LE(this.constraints.length);

        for (const constraint of this.constraints)
        {
            writer.writeUInt8(constraint.chainLength);
            writer.writeUInt8(constraint.constraintType);
            writer.writeFixedString(constraint.sourceVolume, 16);
            writer.writeVector3F(constraint.sourceOffset);
            writer.writeFixedString(constraint.targetVolume, 16);
            writer.writeVector3F(constraint.targetOffset);
            writer.writeVector3F(constraint.targetDir);
            writer.writeFloatLE(constraint.easeInStart);
            writer.writeFloatLE(constraint.easeInStop);
            writer.writeFloatLE(constraint.easeOutStart);
            writer.writeFloatLE(constraint.easeOutStop);
        }
        return writer.get();
    }
}
