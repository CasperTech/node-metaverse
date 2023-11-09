import { ExtraParamType } from '../../enums/ExtraParamType';
import { FlexibleData } from './FlexibleData';
import { LightData } from './LightData';
import { LightImageData } from './LightImageData';
import { MeshData } from './MeshData';
import { SculptData } from './SculptData';
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Color4 } from '../Color4';
import { ExtendedMeshData } from './ExtendedMeshData';
import { RenderMaterialData } from './RenderMaterialData';
import { ReflectionProbeData } from './ReflectionProbeData';
import { ExtendedMeshFlags } from './ExtendedMeshFlags';
import { ReflectionProbeFlags } from './ReflectionProbeFlags';
import { RenderMaterialParam } from './RenderMaterialParam';

export class ExtraParams
{
    flexibleData: FlexibleData | null = null;
    lightData: LightData | null = null;
    lightImageData: LightImageData | null = null;
    meshData: MeshData | null = null;
    sculptData: SculptData | null = null;
    extendedMeshData: ExtendedMeshData | null = null;
    renderMaterialData: RenderMaterialData | null = null;
    reflectionProbeData: ReflectionProbeData | null = null;

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
            // UNUSED: const type: ExtraParamType = buf.readUInt16LE(pos);
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
                    case ExtraParamType.ExtendedMesh:
                        ep.extendedMeshData = new ExtendedMeshData(buf, pos, paramLength);
                        break;
                    case ExtraParamType.RenderMaterial:
                        ep.renderMaterialData = new RenderMaterialData(buf, pos, paramLength);
                        break;
                    case ExtraParamType.ReflectionProbe:
                        ep.reflectionProbeData = new ReflectionProbeData(buf, pos, paramLength);
                        break;
                }

                pos += paramLength;
            }
            return ep;
        }
        return ep;
    }
    public setMeshData(type: number, uuid: UUID): void
    {
        this.meshData = new MeshData();
        this.meshData.type = type;
        this.meshData.meshData = uuid;
    }

    public setExtendedMeshData(flags: ExtendedMeshFlags): void
    {
        this.extendedMeshData = new ExtendedMeshData();
        this.extendedMeshData.flags = flags;
    }

    public setReflectionProbeData(ambiance: number, clipDistance: number, flags: ReflectionProbeFlags): void
    {
        this.reflectionProbeData = new ReflectionProbeData();
        this.reflectionProbeData.ambiance = ambiance;
        this.reflectionProbeData.clipDistance = clipDistance;
        this.reflectionProbeData.flags = flags;
    }

    public setRenderMaterialData(params: RenderMaterialParam[]): void
    {
        this.renderMaterialData = new RenderMaterialData();
        this.renderMaterialData.params = params;
    }

    public setSculptData(type: number, uuid: UUID): void
    {
        this.sculptData = new SculptData();
        this.sculptData.type = type;
        this.sculptData.texture = uuid;
    }
    public setFlexiData(softness: number, tension: number, drag: number, gravity: number, wind: number, force: Vector3): void
    {
        this.flexibleData = new FlexibleData();
        this.flexibleData.Softness = softness;
        this.flexibleData.Tension = tension;
        this.flexibleData.Drag = drag;
        this.flexibleData.Gravity = gravity;
        this.flexibleData.Wind = wind;
        this.flexibleData.Force = force;
    }
    public setLightData(color: Color4, radius: number, cutoff: number, falloff: number, intensity: number): void
    {
        this.lightData = new LightData();
        this.lightData.Color = color;
        this.lightData.Radius = radius;
        this.lightData.Cutoff = cutoff;
        this.lightData.Falloff = falloff;
        this.lightData.Intensity = intensity;
    }
    public toBuffer(): Buffer
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
        if (this.extendedMeshData !== null)
        {
            paramCount++;
            totalLength = totalLength + 2 + 4 + 4;
        }
        if (this.reflectionProbeData !== null)
        {
            paramCount++;
            totalLength = totalLength + 2 + 4 + 9;
        }
        if (this.renderMaterialData !== null)
        {
            paramCount++;
            totalLength = totalLength + 2 + 4 + 1 + (this.renderMaterialData.params.length * 17)
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
        if (this.extendedMeshData !== null)
        {
            buf.writeUInt16LE(ExtraParamType.ExtendedMesh, pos); pos = pos + 2;
            buf.writeUInt32LE(4, pos); pos = pos + 4;
            this.extendedMeshData.writeToBuffer(buf, pos); pos = pos + 4;
        }
        if (this.reflectionProbeData !== null)
        {
            buf.writeUInt16LE(ExtraParamType.ReflectionProbe, pos); pos = pos + 2;
            buf.writeUInt32LE(9, pos); pos = pos + 4;
            this.reflectionProbeData.writeToBuffer(buf, pos); pos = pos + 9;
        }
        if (this.renderMaterialData !== null)
        {
            buf.writeUInt16LE(ExtraParamType.RenderMaterial, pos); pos = pos + 2;
            buf.writeUInt32LE(1 + (this.renderMaterialData.params.length * 17), pos); pos = pos + 4;
            this.renderMaterialData.writeToBuffer(buf, pos); pos = pos + 1 + (this.renderMaterialData.params.length * 17);
        }
        return buf;
    }
    public toBase64(): string
    {
        return this.toBuffer().toString('base64');
    }
}
