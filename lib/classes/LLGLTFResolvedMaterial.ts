import type { LLGLTFMaterialData } from './LLGLTFMaterialData';
import type { LLGLTFMaterialOverride } from './LLGLTFMaterialOverride';
import { UUID } from './UUID';

export interface LLGLTFResolvedTransform
{
    offset: [number, number];
    scale: [number, number];
    rotation: number;
}

export interface LLGLTFResolvedTexture
{
    textureID: string | null;
    transform: LLGLTFResolvedTransform;
}

interface LLGLTFTextureInfoLike
{
    index: number;
    extensions?: Record<string, unknown>;
}

export class LLGLTFResolvedMaterial
{
    public baseColorFactor: [number, number, number, number] = [1, 1, 1, 1];
    public emissiveFactor: [number, number, number] = [0, 0, 0];
    public metallicFactor: number = 1;
    public roughnessFactor: number = 1;
    public alphaMode: number = 0;
    public alphaCutoff: number = 0.5;
    public doubleSided: boolean = false;
    public baseColorTexture: LLGLTFResolvedTexture = LLGLTFResolvedMaterial.defaultTexture();
    public normalTexture: LLGLTFResolvedTexture = LLGLTFResolvedMaterial.defaultTexture();
    public metallicRoughnessTexture: LLGLTFResolvedTexture = LLGLTFResolvedMaterial.defaultTexture();
    public emissiveTexture: LLGLTFResolvedTexture = LLGLTFResolvedMaterial.defaultTexture();

    public static resolve(base?: LLGLTFMaterialData, override?: LLGLTFMaterialOverride): LLGLTFResolvedMaterial
    {
        const resolved = base !== undefined ? LLGLTFResolvedMaterial.fromMaterialData(base) : new LLGLTFResolvedMaterial();
        if (override !== undefined)
        {
            resolved.applyOverride(override);
        }
        return resolved;
    }

    public static fromMaterialData(data: LLGLTFMaterialData): LLGLTFResolvedMaterial
    {
        const resolved = new LLGLTFResolvedMaterial();
        const mat = data.materials?.[0];
        if (mat === undefined)
        {
            return resolved;
        }

        const pbr = mat.pbrMetallicRoughness;
        if (pbr !== undefined)
        {
            if (pbr.baseColorFactor !== undefined && pbr.baseColorFactor.length === 4)
            {
                resolved.baseColorFactor = [pbr.baseColorFactor[0], pbr.baseColorFactor[1], pbr.baseColorFactor[2], pbr.baseColorFactor[3]];
            }
            if (pbr.metallicFactor !== undefined)
            {
                resolved.metallicFactor = pbr.metallicFactor;
            }
            if (pbr.roughnessFactor !== undefined)
            {
                resolved.roughnessFactor = pbr.roughnessFactor;
            }
            resolved.baseColorTexture = LLGLTFResolvedMaterial.resolveTexture(data, pbr.baseColorTexture);
            resolved.metallicRoughnessTexture = LLGLTFResolvedMaterial.resolveTexture(data, pbr.metallicRoughnessTexture);
        }

        resolved.normalTexture = LLGLTFResolvedMaterial.resolveTexture(data, mat.normalTexture);
        resolved.emissiveTexture = LLGLTFResolvedMaterial.resolveTexture(data, mat.emissiveTexture);

        if (mat.emissiveFactor !== undefined && mat.emissiveFactor.length === 3)
        {
            resolved.emissiveFactor = [mat.emissiveFactor[0], mat.emissiveFactor[1], mat.emissiveFactor[2]];
        }
        if (mat.alphaCutoff !== undefined)
        {
            resolved.alphaCutoff = mat.alphaCutoff;
        }
        resolved.doubleSided = mat.doubleSided === true;

        switch (mat.alphaMode)
        {
            case 'BLEND':
                resolved.alphaMode = 1;
                break;
            case 'MASK':
                resolved.alphaMode = 2;
                break;
            default:
                resolved.alphaMode = 0;
                break;
        }

        return resolved;
    }

    public applyOverride(override: LLGLTFMaterialOverride): void
    {
        if (override.baseColor !== undefined && override.baseColor.length === 4)
        {
            this.baseColorFactor = [override.baseColor[0], override.baseColor[1], override.baseColor[2], override.baseColor[3]];
        }
        if (override.emissiveFactor !== undefined && override.emissiveFactor.length === 3)
        {
            this.emissiveFactor = [override.emissiveFactor[0], override.emissiveFactor[1], override.emissiveFactor[2]];
        }
        if (override.metallicFactor !== undefined)
        {
            this.metallicFactor = override.metallicFactor;
        }
        if (override.roughnessFactor !== undefined)
        {
            this.roughnessFactor = override.roughnessFactor;
        }
        if (override.alphaMode !== undefined)
        {
            this.alphaMode = override.alphaMode;
        }
        if (override.alphaCutoff !== undefined)
        {
            this.alphaCutoff = override.alphaCutoff;
        }
        if (override.doubleSided !== undefined)
        {
            this.doubleSided = override.doubleSided;
        }

        const targets = [this.baseColorTexture, this.normalTexture, this.metallicRoughnessTexture, this.emissiveTexture];

        if (override.textures !== undefined)
        {
            for (let i = 0; i < targets.length; i++)
            {
                const texture = override.textures[i];
                if (texture !== undefined)
                {
                    targets[i].textureID = texture;
                }
            }
        }

        if (override.textureTransforms !== undefined)
        {
            for (let i = 0; i < targets.length; i++)
            {
                const transform = override.textureTransforms[i];
                if (transform === undefined || transform === null)
                {
                    continue;
                }
                if (transform.offset !== undefined && transform.offset.length === 2)
                {
                    targets[i].transform.offset = [transform.offset[0], transform.offset[1]];
                }
                if (transform.scale !== undefined && transform.scale.length === 2)
                {
                    targets[i].transform.scale = [transform.scale[0], transform.scale[1]];
                }
                if (transform.rotation !== undefined)
                {
                    targets[i].transform.rotation = transform.rotation;
                }
            }
        }
    }

    private static defaultTexture(): LLGLTFResolvedTexture
    {
        return {
            textureID: null,
            transform: {
                offset: [0, 0],
                scale: [1, 1],
                rotation: 0
            }
        };
    }

    private static resolveTexture(data: LLGLTFMaterialData, info: LLGLTFTextureInfoLike | undefined): LLGLTFResolvedTexture
    {
        const resolved = LLGLTFResolvedMaterial.defaultTexture();
        if (info === undefined)
        {
            return resolved;
        }

        const texture = data.textures?.[info.index];
        const source = texture?.source;
        if (source !== undefined)
        {
            const image = data.images?.[source];
            if (image !== undefined && 'uri' in image && image.uri !== undefined && image.uri !== UUID.zero().toString())
            {
                resolved.textureID = image.uri;
            }
        }

        const transform = info.extensions?.KHR_texture_transform as { offset?: number[]; scale?: number[]; rotation?: number } | undefined;
        if (transform !== undefined)
        {
            if (transform.offset !== undefined && transform.offset.length === 2)
            {
                resolved.transform.offset = [transform.offset[0], transform.offset[1]];
            }
            if (transform.scale !== undefined && transform.scale.length === 2)
            {
                resolved.transform.scale = [transform.scale[0], transform.scale[1]];
            }
            if (transform.rotation !== undefined)
            {
                resolved.transform.rotation = transform.rotation;
            }
        }

        return resolved;
    }
}
