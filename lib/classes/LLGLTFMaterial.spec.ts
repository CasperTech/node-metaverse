import { LLGLTFMaterial } from './LLGLTFMaterial';
import * as assert from 'assert';

describe('LLGLTFMaterial', () =>
{
    describe('parse', () =>
    {
        it ('should parse a valid GLTF material asset', () =>
        {
            const buf = Buffer.from('PD8gTExTRC9CaW5hcnkgPz4KewAAAANrAAAABGRhdGFzAAABznsiYXNzZXQiOnsidmVyc2lvbiI6IjIuMCJ9LCJpbWFnZXMiOlt7InVyaSI6IjJjN2U3MzMyLTM3MTctNWY0ZS04ZjIyLTZlZTlkYTUyNzVmYiJ9LHsidXJpIjoiMTA3OGY1ZWMtMWM1Ni1lNzNmLThmOGYtYmUzNmM0MGU1MTIxIn0seyJ1cmkiOiIyMzBkMmQyZC1iMDkyLTliZjUtYmE3ZS1iMzE5NTY2MzIyYTYifSx7InVyaSI6IjIzMGQyZDJkLWIwOTItOWJmNS1iYTdlLWIzMTk1NjYzMjJhNiJ9XSwibWF0ZXJpYWxzIjpbeyJub3JtYWxUZXh0dXJlIjp7ImluZGV4IjoxfSwib2NjbHVzaW9uVGV4dHVyZSI6eyJpbmRleCI6M30sInBick1ldGFsbGljUm91Z2huZXNzIjp7ImJhc2VDb2xvclRleHR1cmUiOnsiaW5kZXgiOjB9LCJtZXRhbGxpY1JvdWdobmVzc1RleHR1cmUiOnsiaW5kZXgiOjJ9fX1dLCJ0ZXh0dXJlcyI6W3sic291cmNlIjowfSx7InNvdXJjZSI6MX0seyJzb3VyY2UiOjJ9LHsic291cmNlIjozfV19CmsAAAAEdHlwZXMAAAAIR0xURiAyLjBrAAAAB3ZlcnNpb25zAAAAAzEuMX0A', 'base64');
            const mat = new LLGLTFMaterial(buf);

            assert.equal(mat.version, '1.1');
            assert.equal(mat.type, 'GLTF 2.0');
            assert.ok(mat.data);
            assert.equal(mat.data.asset?.version, '2.0');
            assert.equal(mat.data.images?.length, 4);
            let image = mat.data?.images?.[0];
            if (image && 'uri' in image)
            {
                assert.equal(image.uri, '2c7e7332-3717-5f4e-8f22-6ee9da5275fb');
            }
            else
            {
                assert(false, 'Image missing');
            }
            image = mat.data?.images?.[1];
            if (image && 'uri' in image)
            {
                assert.equal(image.uri, '1078f5ec-1c56-e73f-8f8f-be36c40e5121');
            }
            else
            {
                assert(false, 'Image missing');
            }
            image = mat.data?.images?.[2];
            if (image && 'uri' in image)
            {
                assert.equal(image.uri, '230d2d2d-b092-9bf5-ba7e-b319566322a6');
            }
            else
            {
                assert(false, 'Image missing');
            }
            image = mat.data?.images?.[3];
            if (image && 'uri' in image)
            {
                assert.equal(image.uri, '230d2d2d-b092-9bf5-ba7e-b319566322a6');
            }
            else
            {
                assert(false, 'Image missing');
            }

            assert.equal(mat.data.materials?.length, 1);

            const mat0 = mat.data.materials?.[0];
            if (mat0)
            {
                assert.equal(mat0.normalTexture?.index, 1);
                assert.equal(mat0.occlusionTexture?.index, 3);
                assert.equal(mat0.pbrMetallicRoughness?.baseColorTexture?.index, 0);
                assert.equal(mat0.pbrMetallicRoughness?.metallicRoughnessTexture?.index, 2);
            }
            else
            {
                assert(false, 'Material missing');
            }

            assert.equal(mat.data.textures?.length, 4);
            assert.equal(mat.data.textures?.[0].source, 0);
            assert.equal(mat.data.textures?.[1].source, 1);
            assert.equal(mat.data.textures?.[2].source, 2);
            assert.equal(mat.data.textures?.[3].source, 3);
        });
    });
});
