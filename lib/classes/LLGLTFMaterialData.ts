export interface LLGLTFMaterialData
{
    asset: {
        version: string;
    };
    images: {
        uri: string;
    }[];
    materials: {
        normalTexture: {
            index: number
        },
        occlusionTexture: {
            index: number;
        },
        pbrMetallicRoughness: {
            baseColorTexture: {
                index: number
            },
            metallicRoughnessTexture: {
                index: number
            }
        }
    }[];
    textures: {
        source: number
    }[];
}
