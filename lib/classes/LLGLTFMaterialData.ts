export interface LLGLTFExtensionsAndExtras
{
    extensions?: Record<string, unknown>
    extras?: Record<string, unknown>
}

export interface LLGLTFTexture
{
    index: number,
    extensions?: Record<string, unknown>,
    extras?: Record<string, unknown>,
    texCoord?: number,
}

export type LLGLTFTextureInfo = LLGLTFTexture & LLGLTFExtensionsAndExtras;

export interface LLGLTFMaterialEntry
{
    name?: string;
    emissiveFactor?: number[];
    alphaMode?: string;
    alphaCutoff?: number;
    doubleSided?: boolean;
    pbrMetallicRoughness?: {
        baseColorFactor?: number[];
        baseColorTexture?: LLGLTFTextureInfo;
        metallicRoughnessTexture?: LLGLTFTextureInfo;
        metallicFactor?: number;
        roughnessFactor?: number;
    } & LLGLTFExtensionsAndExtras,
    normalTexture?: {
        index: number;
        texCoord?: number;
        scale?: number;
    } & LLGLTFExtensionsAndExtras,
    occlusionTexture?: {
        index: number;
        texCoord?: number;
        strength?: number;
    } & LLGLTFExtensionsAndExtras,
    emissiveTexture?: {
        extensions?: {
            KHR_texture_transform?: {
                offset: number[],
                rotation: number,
                scale: number[]
            }
        },
        index: number
        texCoord?: number;
    }
}

export interface LLGLTFMaterialDataPart
{
    asset?: {
        version: string;
        generator?: string;
        minVersion?: string;
        copyright?: string;
    } & LLGLTFExtensionsAndExtras;
    extensionsUsed?: string[];
    extensionsRequired?: string[];
    buffers?: ({
        byteLength: number;
        uri?: string;
        type?: string;
        name?: string;
    } & LLGLTFExtensionsAndExtras)[],
    bufferViews?: ({
        buffer: number;
        byteOffset?: number;
        byteLength: number;
        byteStride?: number;
        target: number;
        name?: string;
    } & LLGLTFExtensionsAndExtras)[],
    accessors?: ({
        bufferView?: number;
        byteOffset?: number;
        normalized?: number;
        componentType: number;
        count: number;
        type: string;
        name?: string;
        minValues?: number[];
        maxValues?: number[];
        sparse?: {
            count: number;
            bufferView: number;
            indices: {
                bufferView: number;
                byteOffset?: number;
                componentType?: number;
            } & LLGLTFExtensionsAndExtras,
            values: {
                bufferView: number;
                byteOffset?: number;
            } & LLGLTFExtensionsAndExtras
        } & LLGLTFExtensionsAndExtras
    } & LLGLTFExtensionsAndExtras)[];
    meshes?: ({
        name?: string;
        primitives?: ({
            material?: number;
            mode?: number;
            indices?: number;
            targets?: Record<string, number>[];
        } & LLGLTFExtensionsAndExtras)[];
        weights?: number[];
    } & LLGLTFExtensionsAndExtras)[],
    nodes?: ({
        name?: string;
        skin?: number;
        camera?: number;
        mesh?: number;
        children?: number[];
        weights?: number[];
        emitter?: number;
        light?: number;
    } & (
        {
            rotation?: number[];
            scale?: number[];
            translaction?: number[]
        } | {
            matrix?: number[]
        }
    )) & LLGLTFExtensionsAndExtras[],
    scenes?: ({
        name?: string;
        nodes?: number[];
    } & LLGLTFExtensionsAndExtras)[];
    scene?: number;
    materials?: (LLGLTFMaterialEntry & LLGLTFExtensionsAndExtras)[];
    images?: (({
        bufferView: number;
        mimeType: string;
        width: number;
        height: number;
    } | {
        uri: string;
    }) & LLGLTFExtensionsAndExtras)[];
    textures?: ({
        sampler?: number;
        source?: number;
        name?: string;
    } & LLGLTFExtensionsAndExtras)[];
    animations?: ({
        name?: string;
        channels?: ({
            sampler: number;
            target?: {
                node?: number;
                path: string;

            } & LLGLTFExtensionsAndExtras
        } & LLGLTFExtensionsAndExtras)[]
        samplers?: ({
            input: number;
            output: number;
            interpolation?: string;
        } & LLGLTFExtensionsAndExtras)[]
    } & LLGLTFExtensionsAndExtras)[];
    skins?: ({
        name?: string;
        joints?: number[];
        skeleton?: number;
        inverseBindMatrices: number;
    } & LLGLTFExtensionsAndExtras)[];
    samplers?: ({
        name?: string;
        minFilter?: number;
        magFilter: number;
        wrapS?: number;
        wrapT?: number;
    } & LLGLTFExtensionsAndExtras)[];
    cameras?: (({
        name?: string;
        type: 'orthographic';
        orthographic: {
            xmag: number;
            ymag: number;
            zfar: number;
            znear: number;
        } & LLGLTFExtensionsAndExtras
    } | {
        name?: string;
        type: 'perspective';
        perspective: {
            yfov: number;
            znear: number;
            aspectRatio?: number;
            zfar?: number;
        } & LLGLTFExtensionsAndExtras
    }) & LLGLTFExtensionsAndExtras)[];
}

export type LLGLTFMaterialData = LLGLTFMaterialDataPart & LLGLTFExtensionsAndExtras;
