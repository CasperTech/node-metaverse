import { LLGLTFResolvedMaterial } from './LLGLTFResolvedMaterial';
import { LLGLTFMaterialOverride } from './LLGLTFMaterialOverride';
import type { LLGLTFMaterialData } from './LLGLTFMaterialData';
import * as assert from 'assert';

const base: LLGLTFMaterialData = {
    materials: [
        {
            pbrMetallicRoughness: {
                baseColorFactor: [1, 0, 0, 1],
                metallicFactor: 0.25,
                roughnessFactor: 0.75,
                baseColorTexture: {
                    index: 0,
                    extensions: {
                        KHR_texture_transform: {
                            offset: [0.1, 0.2],
                            scale: [2, 2],
                            rotation: 0.5
                        }
                    }
                },
                metallicRoughnessTexture: { index: 1 }
            },
            normalTexture: { index: 2 },
            emissiveFactor: [0.3, 0.3, 0.3],
            emissiveTexture: { index: 3 },
            alphaMode: 'MASK',
            alphaCutoff: 0.4,
            doubleSided: true
        }
    ],
    textures: [{ source: 0 }, { source: 1 }, { source: 2 }, { source: 3 }],
    images: [
        { uri: 'a6edc906-2f9f-5fb2-a373-efac406f0ef2' },
        { uri: '2f70a4f7-4ece-48d2-8963-32192608067d' },
        { uri: '45a45cc0-463c-49dd-9133-5202399a16d4' },
        { uri: '39bf5b2b-0619-4892-872c-024e2f601684' }
    ]
};

describe('LLGLTFResolvedMaterial', () =>
{
    it('flattens a base material', () =>
    {
        const resolved = LLGLTFResolvedMaterial.fromMaterialData(base);
        assert.deepEqual(resolved.baseColorFactor, [1, 0, 0, 1]);
        assert.equal(resolved.metallicFactor, 0.25);
        assert.equal(resolved.roughnessFactor, 0.75);
        assert.equal(resolved.alphaMode, 2);
        assert.equal(resolved.alphaCutoff, 0.4);
        assert.equal(resolved.doubleSided, true);
        assert.equal(resolved.baseColorTexture.textureID, 'a6edc906-2f9f-5fb2-a373-efac406f0ef2');
        assert.deepEqual(resolved.baseColorTexture.transform.offset, [0.1, 0.2]);
        assert.deepEqual(resolved.baseColorTexture.transform.scale, [2, 2]);
        assert.equal(resolved.baseColorTexture.transform.rotation, 0.5);
        assert.equal(resolved.metallicRoughnessTexture.textureID, '2f70a4f7-4ece-48d2-8963-32192608067d');
        assert.equal(resolved.normalTexture.textureID, '45a45cc0-463c-49dd-9133-5202399a16d4');
        assert.equal(resolved.emissiveTexture.textureID, '39bf5b2b-0619-4892-872c-024e2f601684');
    });

    it('applies an override on top of a base', () =>
    {
        const over = new LLGLTFMaterialOverride();
        over.metallicFactor = 0.9;
        over.baseColor = [0, 1, 0, 1];
        over.textures = [null, undefined as unknown as string, 'cccccccc-cccc-cccc-cccc-cccccccccccc', undefined as unknown as string];

        const resolved = LLGLTFResolvedMaterial.resolve(base, over);
        assert.equal(resolved.metallicFactor, 0.9);
        assert.equal(resolved.roughnessFactor, 0.75);
        assert.deepEqual(resolved.baseColorFactor, [0, 1, 0, 1]);
        assert.equal(resolved.baseColorTexture.textureID, null);
        assert.equal(resolved.metallicRoughnessTexture.textureID, 'cccccccc-cccc-cccc-cccc-cccccccccccc');
        assert.equal(resolved.normalTexture.textureID, '45a45cc0-463c-49dd-9133-5202399a16d4');
    });

    it('resolves an override with no base from defaults', () =>
    {
        const over = new LLGLTFMaterialOverride();
        over.roughnessFactor = 0.1;
        over.emissiveFactor = [1, 1, 1];

        const resolved = LLGLTFResolvedMaterial.resolve(undefined, over);
        assert.equal(resolved.metallicFactor, 1);
        assert.equal(resolved.roughnessFactor, 0.1);
        assert.deepEqual(resolved.baseColorFactor, [1, 1, 1, 1]);
        assert.deepEqual(resolved.emissiveFactor, [1, 1, 1]);
        assert.equal(resolved.baseColorTexture.textureID, null);
    });
});
