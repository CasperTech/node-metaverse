import { UUID } from '../UUID';
import { Color4 } from '../Color4';
import * as LLSD from '@caspertech/llsd';
import { Utils } from '../Utils';

export class Material
{
    public alphaMaskCutoff: number;
    public diffuseAlphaMode: number;
    public envIntensity: number;
    public normMap: UUID;
    public normOffsetX: number;
    public normOffsetY: number;
    public normRepeatX: number;
    public normRepeatY: number;
    public normRotation: number;
    public specColor: Color4;
    public specExp: number;
    public specMap: UUID;
    public specOffsetX: number;
    public specOffsetY: number;
    public specRepeatX: number;
    public specRepeatY: number;
    public specRotation: number;

    public static fromLLSD(llsd: string): Material
    {
        const parsed = LLSD.LLSD.parseXML(llsd);
        return this.fromLLSDObject(parsed);
    }

    public static fromLLSDObject(parsed: any): Material
    {
        const material = new Material();
        if (parsed.AlphaMaskCutoff !== undefined)
        {
            material.alphaMaskCutoff = parsed.AlphaMaskCutoff;
        }
        if (parsed.DiffuseAlphaMode !== undefined)
        {
            material.diffuseAlphaMode = parsed.DiffuseAlphaMode;
        }
        if (parsed.EnvIntensity !== undefined)
        {
            material.envIntensity = parsed.EnvIntensity;
        }
        if (parsed.NormMap !== undefined)
        {
            material.normMap = new UUID(parsed.NormMap.toString())
        }
        if (parsed.NormOffsetX !== undefined)
        {
            material.normOffsetX = parsed.NormOffsetX;
        }
        if (parsed.NormOffsetY !== undefined)
        {
            material.normOffsetY = parsed.NormOffsetY;
        }
        if (parsed.NormRepeatX !== undefined)
        {
            material.normRepeatX = parsed.NormRepeatX;
        }
        if (parsed.NormRepeatY !== undefined)
        {
            material.normRepeatY = parsed.NormRepeatY;
        }
        if (parsed.NormRotation !== undefined)
        {
            material.normRotation = parsed.NormRotation;
        }
        if (parsed.SpecColor !== undefined && Array.isArray(parsed.SpecColor) && parsed.SpecColor.length > 3)
        {
            material.specColor = new Color4([
                parsed.SpecColor[0],
                parsed.SpecColor[1],
                parsed.SpecColor[2],
                parsed.SpecColor[3]
            ]);
        }
        if (parsed.SpecExp !== undefined)
        {
            material.specExp = parsed.SpecExp;
        }
        if (parsed.SpecMap !== undefined)
        {
            material.specMap = new UUID(parsed.SpecMap.toString())
        }
        if (parsed.SpecOffsetX !== undefined)
        {
            material.specOffsetX = parsed.SpecOffsetX;
        }
        if (parsed.SpecOffsetY !== undefined)
        {
            material.specOffsetY = parsed.SpecOffsetY;
        }
        if (parsed.SpecRepeatX !== undefined)
        {
            material.specRepeatX = parsed.SpecRepeatX;
        }
        if (parsed.SpecRepeatY !== undefined)
        {
            material.specRepeatY = parsed.SpecRepeatY;
        }
        if (parsed.SpecRotation !== undefined)
        {
            material.specRotation = parsed.SpecRotation;
        }
        return material;
    }

    public toLLSDObject(): any
    {
        return {
            'AlphaMaskCutoff': this.alphaMaskCutoff,
            'DiffuseAlphaMode': this.diffuseAlphaMode,
            'EnvIntensity': this.envIntensity,
            'NormMap': new LLSD.UUID(this.normMap.toString()),
            'NormOffsetX': this.normOffsetX,
            'NormOffsetY': this.normOffsetY,
            'NormRepeatX': this.normRepeatX,
            'NormRepeatY': this.normRepeatY,
            'NormRotation': this.normRotation,
            'SpecColor': [
                this.specColor.getRed(),
                this.specColor.getGreen(),
                this.specColor.getBlue(),
                this.specColor.getAlpha()
            ],
            'SpecExp': this.specExp,
            'SpecMap': new LLSD.UUID(this.specMap.toString()),
            'SpecOffsetX': this.specOffsetX,
            'SpecOffsetY': this.specOffsetY,
            'SpecRepeatX': this.specRepeatX,
            'SpecRepeatY': this.specRepeatY,
            'SpecRotation': this.specRotation,
        };
    }

    public toLLSD(): string
    {
        return String(LLSD.LLSD.formatXML(this.toLLSDObject()));
    }

    public async toAsset(uuid: UUID): Promise<Buffer>
    {
        const asset = {
                'ID': new LLSD.UUID(uuid.toString()),
                'Material': this.toLLSD()
        };
        const binary = LLSD.LLSD.formatBinary(asset);
        return Utils.deflate(Buffer.from(binary.toArray()));
    }
}
