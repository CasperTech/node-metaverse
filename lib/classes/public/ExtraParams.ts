import {GameObject} from './GameObject';
import {ExtraParamType} from '../../enums/ExtraParamType';
import {FlexibleData} from './FlexibleData';
import {LightData} from './LightData';
import {LightImageData} from './LightImageData';
import {MeshData} from './MeshData';
import {SculptData} from './SculptData';
import {UUID} from '../UUID';
import {Vector3} from '../Vector3';
import {Color4} from '../Color4';

export class ExtraParams
{
    flexibleData: FlexibleData | null = null;
    lightData: LightData | null = null;
    lightImageData: LightImageData | null = null;
    meshData: MeshData | null = null;
    sculptData: SculptData | null = null;

    static getLengthOfParams(buf: Buffer, pos: number): number
    {
        const startPos = pos;
        if (pos >= buf.length)
        {
            return 0;
        }
        const extraParamCount = buf.readUInt8(pos++);
        for (let k = 0; k < extraParamCount; k++)
        {
            const type: ExtraParamType = buf.readUInt16LE(pos);
            pos = pos + 2;
            const paramLength = buf.readUInt32LE(pos);
            pos = pos + 4 + paramLength;
        }
        return pos - startPos;
    }
    static from(buf: Buffer): ExtraParams
    {
        const ep = new ExtraParams();
        if (buf instanceof Buffer)
        {
            let pos = 0;
            if (pos >= buf.length)
            {
                return ep;
            }
            const extraParamCount = buf.readUInt8(pos++);
            for (let k = 0; k < extraParamCount; k++)
            {
                const type: ExtraParamType = buf.readUInt16LE(pos);
                pos = pos + 2;
                const paramLength = buf.readUInt32LE(pos);
                pos = pos + 4;

                switch (type)
                {
                    case ExtraParamType.Flexible:
                        ep.flexibleData = new FlexibleData(buf, pos, paramLength);
                        break;
                    case ExtraParamType.Light:
                        ep.lightData = new LightData(buf, pos, paramLength);
                        break;
                    case ExtraParamType.LightImage:
                        ep.lightImageData = new LightImageData(buf, pos, paramLength);
                        break;
                    case ExtraParamType.Mesh:
                        ep.meshData = new MeshData(buf, pos, paramLength);
                        break;
                    case ExtraParamType.Sculpt:
                        ep.sculptData = new SculptData(buf, pos, paramLength);
                        break;
                }

                pos += paramLength;
            }
            return ep;
        }
        return ep;
    }
    setMeshData(type: number, uuid: UUID)
    {
        this.meshData = new MeshData();
        this.meshData.type = type;
        this.meshData.meshData = uuid;
    }
    setSculptData(type: number, uuid: UUID)
    {
        this.sculptData = new SculptData();
        this.sculptData.type = type;
        this.sculptData.texture = uuid;
    }
    setFlexiData(softness: number, tension: number, drag: number, gravity: number, wind: number, force: Vector3)
    {
        this.flexibleData = new FlexibleData();
        this.flexibleData.Softness = softness;
        this.flexibleData.Tension = tension;
        this.flexibleData.Drag = drag;
        this.flexibleData.Gravity = gravity;
        this.flexibleData.Wind = wind;
        this.flexibleData.Force = force;
    }
    setLightData(color: Color4, radius: number, cutoff: number, falloff: number, intensity: number)
    {
        this.lightData = new LightData();
        this.lightData.Color = color;
        this.lightData.Radius = radius;
        this.lightData.Cutoff = cutoff;
        this.lightData.Falloff = falloff;
        this.lightData.Intensity = intensity;
    }
    toBuffer(): Buffer
    {
        let totalLength = 1;
        let paramCount = 0;
        if (this.flexibleData !== null)
        {
            paramCount++;
            totalLength = totalLength + 2 + 4 + 16;
        }
        if (this.lightData !== null)
        {
            paramCount++;
            totalLength = totalLength + 2 + 4 + 16;
        }
        if (this.lightImageData !== null)
        {
            paramCount++;
            totalLength = totalLength + 2 + 4 + 28;
        }
        if (this.meshData !== null)
        {
            paramCount++;
            totalLength = totalLength + 2 + 4 + 17;
        }
        if (this.sculptData !== null)
        {
            paramCount++;
            totalLength = totalLength + 2 + 4 + 17;
        }
        const buf = Buffer.allocUnsafe(totalLength);
        let pos = 0;
        buf.writeUInt8(paramCount, pos++);
        if (this.flexibleData !== null)
        {
            buf.writeUInt16LE(ExtraParamType.Flexible, pos); pos = pos + 2;
            buf.writeUInt32LE(16, pos); pos = pos + 4;
            this.flexibleData.writeToBuffer(buf, pos); pos = pos + 16;
        }
        if (this.lightData !== null)
        {
            buf.writeUInt16LE(ExtraParamType.Light, pos); pos = pos + 2;
            buf.writeUInt32LE(16, pos); pos = pos + 4;
            this.lightData.writeToBuffer(buf, pos); pos = pos + 16;
        }
        if (this.lightImageData !== null)
        {
            buf.writeUInt16LE(ExtraParamType.LightImage, pos); pos = pos + 2;
            buf.writeUInt32LE(28, pos); pos = pos + 4;
            this.lightImageData.writeToBuffer(buf, pos); pos = pos + 28;
        }
        if (this.meshData !== null)
        {
            buf.writeUInt16LE(ExtraParamType.Mesh, pos); pos = pos + 2;
            buf.writeUInt32LE(17, pos); pos = pos + 4;
            this.meshData.writeToBuffer(buf, pos); pos = pos + 17;
        }
        if (this.sculptData !== null)
        {
            buf.writeUInt16LE(ExtraParamType.Sculpt, pos); pos = pos + 2;
            buf.writeUInt32LE(17, pos); pos = pos + 4;
            this.sculptData.writeToBuffer(buf, pos); pos = pos + 17;
        }
        return buf;
    }
    toBase64(): string
    {
        return this.toBuffer().toString('base64');
    }
}
