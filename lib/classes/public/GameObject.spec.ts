import { GameObject } from './GameObject';
import { TextureEntry } from '../TextureEntry';
import { LLGLTFMaterialOverride } from '../LLGLTFMaterialOverride';
import { TextureEntryFace } from '../TextureEntryFace';
import { UUID } from '../UUID';
import { Color4 } from '../Color4';
import * as assert from 'assert';

describe('GameObject', () =>
{
    it('Can serialize and unserialize GLTF override data to xml', async() =>
    {
        const go = new GameObject();
        const te = new TextureEntry();
        te.defaultTexture = new TextureEntryFace(null);
        te.defaultTexture.textureID = new UUID('3f268e01-7368-7002-e5fb-cd7af0a3931c');
        te.defaultTexture.rgba = new Color4(1.0, 1.0, 1.0, 1.0);
        te.defaultTexture.glow = 1.0;
        te.defaultTexture.rotation = 0.5;
        te.defaultTexture.media = 0;
        te.defaultTexture.mappingType = 0;
        te.defaultTexture.materialID = new UUID('00000000-0000-0000-0000-000000000000');
        go.TextureEntry = te;
        te.gltfMaterialOverrides = new Map<number, LLGLTFMaterialOverride>();
        const override = new LLGLTFMaterialOverride();
        te.gltfMaterialOverrides.set(0, override)
        override.doubleSided = true;
        override.alphaCutoff = 0.5;
        override.alphaMode = 2;
        override.roughnessFactor = 0.2;
        override.metallicFactor = 0.6;
        override.textures = [
            'c9eca1db-8f2f-4d53-930e-77e6f06d9f37',
            'ec3cfa77-bc40-4fc3-9e81-ce9d51e86b77',
            '1e079cce-eeca-4e05-9a4f-e58d8398ecf1',
            '03573ae5-4c1a-44f7-9cd3-8b49028f9e48'
        ];
        override.emissiveFactor = [0.2, 0.5, 0.6];
        override.baseColor = [0.1, 0.2, 0.3, 0.4];
        override.textureTransforms = [
            {
                offset: [0.1, 0.2],
                scale: [0.5, 0.5],
                rotation: 1
            },
            {
                offset: [0.1, 0.2],
                scale: [0.5, 0.5],
                rotation: 2
            },
            {
                offset: [0.1, 0.2],
                scale: [0.5, 0.5],
                rotation: 3
            },
            {
                offset: [0.1, 0.2],
                scale: [0.5, 0.5],
                rotation: 4
            }
        ];
        te.gltfMaterialOverrides.set(1, override)

        const xml = await go.exportXML();

        const obj = await GameObject.fromXML(xml);
        assert.notEqual(obj, undefined);
        assert.notEqual(obj.TextureEntry, undefined);
        assert.notEqual(obj.TextureEntry?.gltfMaterialOverrides, undefined);
        const overrides = obj.TextureEntry?.gltfMaterialOverrides;
        if (overrides)
        {
            const entry = overrides.get(0);
            if (entry === undefined)
            {
                assert(false, 'Failed to get material override');
            }
            else
            {
                assert.equal(entry.doubleSided, true);
                assert.equal(entry.alphaCutoff, 0.5);
                assert.equal(entry.alphaMode, 2);
                assert.equal(entry.roughnessFactor, 0.2);
                assert.equal(entry.metallicFactor, 0.6);
                if (Array.isArray(entry.textures))
                {
                    assert.equal(entry.textures.length, 4);
                    assert.equal(entry.textures[0], 'c9eca1db-8f2f-4d53-930e-77e6f06d9f37');
                    assert.equal(entry.textures[1], 'ec3cfa77-bc40-4fc3-9e81-ce9d51e86b77');
                    assert.equal(entry.textures[2], '1e079cce-eeca-4e05-9a4f-e58d8398ecf1');
                    assert.equal(entry.textures[3], '03573ae5-4c1a-44f7-9cd3-8b49028f9e48');
                }
                else
                {
                    assert(false, 'Textures is not an array');
                }
                if (Array.isArray(entry.emissiveFactor))
                {
                    assert.equal(entry.emissiveFactor.length, 3);
                    assert.equal(entry.emissiveFactor[0], 0.2);
                    assert.equal(entry.emissiveFactor[1], 0.5);
                    assert.equal(entry.emissiveFactor[2], 0.6);
                }
                else
                {
                    assert(false, 'EmissiveColor is not an array');
                }
                if (Array.isArray(entry.baseColor))
                {
                    assert.equal(entry.baseColor.length, 4);
                    assert.equal(entry.baseColor[0], 0.1);
                    assert.equal(entry.baseColor[1], 0.2);
                    assert.equal(entry.baseColor[2], 0.3);
                    assert.equal(entry.baseColor[3], 0.4);
                }
                else
                {
                    assert(false, 'BaseColor is not an array');
                }
                if (Array.isArray(entry.textureTransforms))
                {
                    assert.equal(entry.textureTransforms.length, 4);
                    for (let x = 0; x < 4; x++)
                    {
                        const transform = entry.textureTransforms[x];
                        if (transform?.scale && Array.isArray(transform.scale))
                        {
                            assert.equal(transform.scale.length, 2);
                            assert.equal(transform.scale[0], 0.5);
                            assert.equal(transform.scale[1], 0.5);
                        }
                        else
                        {
                            assert(false, 'Scale is not an array');
                        }
                        if (transform?.offset && Array.isArray(transform.offset))
                        {
                            assert.equal(transform.offset.length, 2);
                            assert.equal(transform.offset[0], 0.1);
                            assert.equal(transform.offset[1], 0.2);
                        }
                        else
                        {
                            assert(false, 'Offset is not an array');
                        }
                        assert.equal(transform.rotation, x + 1);
                    }
                }
                else
                {
                    assert(false, 'BaseColor is not an array');
                }
            }
        }
    });
});

