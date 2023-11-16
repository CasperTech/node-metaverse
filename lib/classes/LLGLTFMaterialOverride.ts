import {
    LLGLTFExtensionsAndExtras,
    LLGLTFMaterialData,
    LLGLTFMaterialEntry,
    LLGLTFTextureInfo,
} from './LLGLTFMaterialData';
import { UUID } from './UUID';

export interface LLGLTFTextureTransformOverride
{
    offset?: number[];
    scale?: number[];
    rotation?: number
}

export class LLGLTFMaterialOverride
{
    public textures?: (string | null)[];
    public baseColor?: number[];
    public emissiveFactor?: number[];
    public metallicFactor?: number;
    public roughnessFactor?: number;
    public alphaMode?: number;
    public alphaCutoff?: number;
    public doubleSided?: boolean;
    public textureTransforms?: (LLGLTFTextureTransformOverride | null)[];

    public getFullMaterialJSON(): string
    {
        const obj: LLGLTFMaterialData = {};
        obj.asset = {
            version: '2.0',
        };

        let texIndex = 0;

        const material: LLGLTFMaterialEntry & LLGLTFExtensionsAndExtras = {};

        const addTexture = (texNum: number): number | undefined =>
        {
            let idx: number | undefined = undefined;
            if ((this.textures && this.textures.length > texNum && this.textures[texNum] !== null) || (this.textureTransforms && this.textureTransforms.length > texNum && this.textureTransforms[texNum] !== null))
            {
                idx = texIndex++;
                if (idx === 0)
                {
                    obj.images = [];
                    obj.textures = [];
                }

                const texture = this.textures?.[texNum];
                if (texture)
                {
                    obj.images!.push({
                        uri: texture
                    });
                }
                else
                {
                    obj.images!.push({
                        uri: UUID.zero().toString()
                    });
                }

                const tex: {
                    source: number
                } & LLGLTFExtensionsAndExtras = {
                    source: idx
                };

                if (this.textureTransforms && this.textureTransforms.length > texNum && this.textureTransforms[texNum] !== null)
                {
                    const trans = this.textureTransforms[texNum];
                    tex.extensions = {
                        KHR_texture_transform: {
                            offset: trans?.offset ?? undefined,
                            scale: trans?.scale ?? undefined,
                            rotation: trans?.rotation ?? undefined
                        }
                    };
                }

                if (obj.textures === undefined)
                {
                    obj.textures = [
                        tex
                    ];
                }
                else
                {
                    obj.textures.push(tex);
                }
            }
            return idx;
        }

        if (
            this.baseColor !== undefined
            || (this.textures !== undefined
                && ((this.textures.length > 0
                        && this.textures[0] !== undefined
                    )
                    || (this.textures.length > 2
                        && this.textures[2] !== undefined
                    )))
            || this.metallicFactor !== undefined
            || this.roughnessFactor !== undefined
        )
        {
            const pbrMetallicRoughness: {
                baseColorFactor?: number[];
                baseColorTexture?: LLGLTFTextureInfo;
                metallicRoughnessTexture?: LLGLTFTextureInfo;
                metallicFactor?: number;
                roughnessFactor?: number;
            } & LLGLTFExtensionsAndExtras = {
                baseColorFactor: this.baseColor,
                metallicFactor: this.metallicFactor,
                roughnessFactor: this.roughnessFactor
            };


            let texIdx2 = addTexture(0);
            if (texIdx2 !== undefined)
            {
                pbrMetallicRoughness.baseColorTexture = {
                    index: texIdx2
                };
            }

            texIdx2 = addTexture(2);
            if (texIdx2 !== undefined)
            {
                pbrMetallicRoughness.metallicRoughnessTexture = {
                    index: texIdx2
                };

                material.occlusionTexture = {
                    index: texIdx2
                };
            }

            material.pbrMetallicRoughness = pbrMetallicRoughness;
        }

        if (this.alphaMode !== undefined)
        {
            if (this.alphaMode === 0) // OPAQUE
            {
                material.extras = {
                    override_alpha_mode: true
                };
            }
            else if (this.alphaMode === 1)
            {
                material.alphaMode = 'BLEND';
            }
            else if (this.alphaMode === 2)
            {
                material.alphaMode = 'MASK';
            }
        }

        if (this.alphaCutoff !== undefined)
        {
            material.alphaCutoff = this.alphaCutoff;
        }

        if (this.emissiveFactor !== undefined)
        {
            material.emissiveFactor = this.emissiveFactor;
        }

        if (this.doubleSided)
        {
            material.doubleSided = this.doubleSided;
        }
        else if (this.doubleSided === false)
        {
            if (!material.extras)
            {
                material.extras = {};
            }
            material.extras.override_double_sided = true;
        }

        // Emissive Texture
        let texIdx = addTexture(3);
        if (texIdx !== undefined)
        {
            material.emissiveTexture = {
                index: texIdx
            };
        }

        // Normal Map Texture
        texIdx = addTexture(1);
        if (texIdx !== undefined)
        {
            material.normalTexture = {
                index: texIdx
            };
        }

        if (Object.keys(material).length > 0)
        {
            obj.materials = [
                material
            ];
        }

        return JSON.stringify(obj);
    }

    public setTexture(idx: number, uuid: string): void
    {
        if (!this.textures)
        {
            this.textures = [];
        }
        for (let x = this.textures.length; x < idx + 1; x++)
        {
            this.textures.push(null);
        }
        this.textures[idx] = uuid;
    }

    public setTransform(idx: number, trans: LLGLTFTextureTransformOverride): void
    {
        if (!this.textureTransforms)
        {
            this.textureTransforms = [];
        }
        for (let x = this.textureTransforms.length; x < idx + 1; x++)
        {
            this.textureTransforms.push(null);
        }
        this.textureTransforms[idx] = trans;
    }

    public static fromFullMaterialJSON(json: string): LLGLTFMaterialOverride
    {
        const obj = JSON.parse(json) as LLGLTFMaterialData;

        const over = new LLGLTFMaterialOverride();

        if (!obj.materials?.length)
        {
            return over;
        }
        const mat = obj.materials[0];

        const getTexture = (idx: number): { uuid: string | null, transform: LLGLTFTextureTransformOverride | null } =>
        {
            const found: {
                uuid: string | null,
                transform: LLGLTFTextureTransformOverride | null
            } = {
                uuid: null,
                transform: null
            };

            if (obj.textures && Array.isArray(obj.textures) && obj.textures.length > idx)
            {
                const source = obj.textures[idx].source;
                if (source !== undefined && obj.images && Array.isArray(obj.images) && obj.images.length > source)
                {
                    const img = obj.images[source];
                    if ('uri' in img)
                    {
                        found.uuid = img.uri ?? null;
                        if (found.uuid === UUID.zero().toString())
                        {
                            found.uuid = null;
                        }
                    }
                }
                const transform = obj.textures[idx].extensions?.KHR_texture_transform as {
                    offset?: number[],
                    scale?: number[],
                    rotation?: number
                };
                if (transform)
                {
                    found.transform = transform ?? null;
                }
            }

            return found;
        };

        if (mat.pbrMetallicRoughness)
        {
            const pbr = mat.pbrMetallicRoughness;
            if (pbr.metallicFactor !== undefined)
            {
                over.metallicFactor = pbr.metallicFactor;
            }
            if (pbr.roughnessFactor !== undefined)
            {
                over.roughnessFactor = pbr.roughnessFactor;
            }
            if (pbr.baseColorFactor !== undefined && Array.isArray(pbr.baseColorFactor) && pbr.baseColorFactor.length === 4)
            {
                over.baseColor = pbr.baseColorFactor;
            }
            if (pbr.baseColorTexture?.index !== undefined)
            {
                const tex = getTexture(pbr.baseColorTexture.index);
                if (tex && tex.uuid)
                {
                    over.setTexture(0, tex.uuid);
                }
                if (tex && tex.transform)
                {
                    over.setTransform(0, tex.transform);
                }
            }
            if (pbr.metallicRoughnessTexture?.index !== undefined)
            {
                const tex = getTexture(pbr.metallicRoughnessTexture.index);
                if (tex && tex.uuid)
                {
                    over.setTexture(2, tex.uuid);
                }
                if (tex && tex.transform)
                {
                    over.setTransform(2, tex.transform);
                }
            }
        }

        if (mat.alphaMode)
        {
            switch (mat.alphaMode)
            {
                case 'BLEND':
                    over.alphaMode = 1;
                    break;
                case 'MASK':
                    over.alphaMode = 2;
                    break;
            }
        }
        else if (mat.extras && mat.extras.override_alpha_mode)
        {
            over.alphaMode = 0;
        }

        if (mat.alphaCutoff !== undefined)
        {
            over.alphaCutoff = mat.alphaCutoff;
        }

        if (mat.emissiveFactor !== undefined)
        {
            over.emissiveFactor = mat.emissiveFactor;
        }

        if (mat.doubleSided === true)
        {
            over.doubleSided = true;
        }
        else if (mat.extras && mat.extras.override_double_sided)
        {
            over.doubleSided = false;
        }

        if (mat.normalTexture?.index !== undefined)
        {
            const tex = getTexture(mat.normalTexture?.index);
            if (tex && tex.uuid)
            {
                over.setTexture(1, tex.uuid);
            }
            if (tex && tex.transform)
            {
                over.setTransform(1, tex.transform);
            }
        }

        if (mat.emissiveTexture?.index !== undefined)
        {
            const tex = getTexture(mat.emissiveTexture?.index);
            if (tex && tex.uuid)
            {
                over.setTexture(3, tex.uuid);
            }
            if (tex && tex.transform)
            {
                over.setTransform(3, tex.transform);
            }
        }

        return over;
    }
}
