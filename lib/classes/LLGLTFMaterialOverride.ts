export interface LLGLTFTextureTransformOverride
{
    offset: number[];
    scale: number[];
    rotation: number
}

export class LLGLTFMaterialOverride
{
    public textures?: string[];
    public baseColor?: number[];
    public emissiveColor?: number[];
    public metallicFactor?: number;
    public roughnessFactor?: number;
    public alphaMode?: number;
    public alphaCutoff?: number;
    public doubleSided?: boolean;
    public textureTransforms?: LLGLTFTextureTransformOverride[];
}
