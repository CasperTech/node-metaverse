import { LLGLTFMaterialOverride } from './LLGLTFMaterialOverride';
import * as assert from 'assert';


const m = new LLGLTFMaterialOverride();
m.textures = [
    'a6edc906-2f9f-5fb2-a373-efac406f0ef2',
    '2f70a4f7-4ece-48d2-8963-32192608067d',
    '45a45cc0-463c-49dd-9133-5202399a16d4',
    '39bf5b2b-0619-4892-872c-024e2f601684'
];
m.doubleSided = true;
m.emissiveFactor = [
    0.1,
    0.69,
    0.420
];
m.alphaCutoff = 0.42;
m.alphaMode = 1;
m.roughnessFactor = 0.23;
m.metallicFactor = 0.91;
m.baseColor = [
    0.1,
    0.2,
    0.3,
    0.4
];
m.textureTransforms = [
    {
        rotation: 0.43,
        scale: [
            0.2,
            0.4
        ],
        offset: [
            1.0,
            0.5
        ]
    },
    {
        rotation: 0.52,
        scale: [
            0.9,
            0.1
        ],
        offset: [
            0.8,
            0.3
        ]
    },
    {
        rotation: 0.43,
        scale: [
            0.1,
            0.9
        ],
        offset: [
            1.3,
            0.6
        ]
    },
    {
        rotation: 0.43,
        scale: [
            0.0,
            0.11
        ],
        offset: [
            0.5,
            0.4
        ]
    }
];

const m3 = new LLGLTFMaterialOverride();
m3.textures = [
    null,
    null,
    '45a45cc0-463c-49dd-9133-5202399a16d4',
    '39bf5b2b-0619-4892-872c-024e2f601684'
];
m3.doubleSided = false;
m3.emissiveFactor = [
    0.1,
    0.69,
    0.420
];
m3.alphaCutoff = 0.42;
m3.alphaMode = 0;
m3.roughnessFactor = 0.23;
m3.metallicFactor = 0.91;
m3.baseColor = [
    0.1,
    0.2,
    0.3,
    0.4
];
m3.textureTransforms = [
    {
        rotation: 0.43,
        scale: [
            0.2,
            0.4
        ],
        offset: [
            1.0,
            0.5
        ]
    },
    null,
    {
        rotation: 0.43,
        scale: [
            0.1,
            0.9
        ],
        offset: [
            1.3,
            0.6
        ]
    },
    {
        rotation: 0.43,
        scale: [
            0.0,
            0.11
        ],
        offset: [
            0.5,
            0.4
        ]
    }
];

describe('LLGLTFMaterialOverride', () =>
{
    it('outputs valid JSON', () =>
    {
        assert.equal(m.getFullMaterialJSON(), '{"asset":{"version":"2.0"},"images":[{"uri":"a6edc906-2f9f-5fb2-a373-efac406f0ef2"},{"uri":"45a45cc0-463c-49dd-9133-5202399a16d4"},{"uri":"39bf5b2b-0619-4892-872c-024e2f601684"},{"uri":"2f70a4f7-4ece-48d2-8963-32192608067d"}],"textures":[{"source":0,"extensions":{"KHR_texture_transform":{"offset":[1,0.5],"scale":[0.2,0.4],"rotation":0.43}}},{"source":1,"extensions":{"KHR_texture_transform":{"offset":[1.3,0.6],"scale":[0.1,0.9],"rotation":0.43}}},{"source":2,"extensions":{"KHR_texture_transform":{"offset":[0.5,0.4],"scale":[0,0.11],"rotation":0.43}}},{"source":3,"extensions":{"KHR_texture_transform":{"offset":[0.8,0.3],"scale":[0.9,0.1],"rotation":0.52}}}],"materials":[{"occlusionTexture":{"index":1},"pbrMetallicRoughness":{"baseColorFactor":[0.1,0.2,0.3,0.4],"metallicFactor":0.91,"roughnessFactor":0.23,"baseColorTexture":{"index":0},"metallicRoughnessTexture":{"index":1}},"alphaMode":"BLEND","alphaCutoff":0.42,"emissiveFactor":[0.1,0.69,0.42],"doubleSided":true,"emissiveTexture":{"index":2},"normalTexture":{"index":3}}]}');
    })

    it('parses json JSON correctly', () =>
    {
        let json = m.getFullMaterialJSON();
        const m2 = LLGLTFMaterialOverride.fromFullMaterialJSON(json);
        assert.equal(m2.roughnessFactor, m.roughnessFactor);
        assert.equal(m2.doubleSided, m.doubleSided);
        assert.equal(m2.alphaCutoff, m.alphaCutoff);
        assert.equal(m2.alphaMode, m.alphaMode);
        assert.equal(m2.metallicFactor, m.metallicFactor);
        assert.equal(m2.baseColor?.length, m.baseColor?.length);
        assert.equal(m2.baseColor?.[0], m.baseColor?.[0]);
        assert.equal(m2.baseColor?.[1], m.baseColor?.[1]);
        assert.equal(m2.baseColor?.[2], m.baseColor?.[2]);
        assert.equal(m2.baseColor?.[3], m.baseColor?.[3]);
        assert.equal(m2.emissiveFactor?.length, m.emissiveFactor?.length);
        assert.equal(m2.emissiveFactor?.[0], m.emissiveFactor?.[0]);
        assert.equal(m2.emissiveFactor?.[1], m.emissiveFactor?.[1]);
        assert.equal(m2.emissiveFactor?.[2], m.emissiveFactor?.[2]);
        assert.equal(m2.textures?.length, m.textures?.length);
        assert.equal(m2.textures?.[0], m.textures?.[0]);
        assert.equal(m2.textures?.[1], m.textures?.[1]);
        assert.equal(m2.textures?.[2], m.textures?.[2]);
        assert.equal(m2.textures?.[3], m.textures?.[3]);
        assert.equal(m2.textureTransforms?.length, m.textureTransforms?.length);
        assert.equal(m2.textureTransforms?.[0]?.offset?.[0], m.textureTransforms?.[0]?.offset?.[0]);
        assert.equal(m2.textureTransforms?.[0]?.offset?.[1], m.textureTransforms?.[0]?.offset?.[1]);
        assert.equal(m2.textureTransforms?.[0]?.scale?.[0], m.textureTransforms?.[0]?.scale?.[0]);
        assert.equal(m2.textureTransforms?.[0]?.scale?.[1], m.textureTransforms?.[0]?.scale?.[1]);
        assert.equal(m2.textureTransforms?.[0]?.rotation, m.textureTransforms?.[0]?.rotation);

        assert.equal(m2.textureTransforms?.[1]?.offset?.[0], m.textureTransforms?.[1]?.offset?.[0]);
        assert.equal(m2.textureTransforms?.[1]?.offset?.[1], m.textureTransforms?.[1]?.offset?.[1]);
        assert.equal(m2.textureTransforms?.[1]?.scale?.[0], m.textureTransforms?.[1]?.scale?.[0]);
        assert.equal(m2.textureTransforms?.[1]?.scale?.[1], m.textureTransforms?.[1]?.scale?.[1]);
        assert.equal(m2.textureTransforms?.[1]?.rotation, m.textureTransforms?.[1]?.rotation);


        assert.equal(m2.textureTransforms?.[2]?.offset?.[0], m.textureTransforms?.[2]?.offset?.[0]);
        assert.equal(m2.textureTransforms?.[2]?.offset?.[1], m.textureTransforms?.[2]?.offset?.[1]);
        assert.equal(m2.textureTransforms?.[2]?.scale?.[0], m.textureTransforms?.[2]?.scale?.[0]);
        assert.equal(m2.textureTransforms?.[2]?.scale?.[1], m.textureTransforms?.[2]?.scale?.[1]);
        assert.equal(m2.textureTransforms?.[2]?.rotation, m.textureTransforms?.[2]?.rotation);

        assert.equal(m2.textureTransforms?.[3]?.offset?.[0], m.textureTransforms?.[3]?.offset?.[0]);
        assert.equal(m2.textureTransforms?.[3]?.offset?.[1], m.textureTransforms?.[3]?.offset?.[1]);
        assert.equal(m2.textureTransforms?.[3]?.scale?.[0], m.textureTransforms?.[3]?.scale?.[0]);
        assert.equal(m2.textureTransforms?.[3]?.scale?.[1], m.textureTransforms?.[3]?.scale?.[1]);
        assert.equal(m2.textureTransforms?.[3]?.rotation, m.textureTransforms?.[3]?.rotation);

        json = m3.getFullMaterialJSON();
        const m4 = LLGLTFMaterialOverride.fromFullMaterialJSON(json);
        assert.equal(m4.roughnessFactor, m3.roughnessFactor);
        assert.equal(m4.doubleSided, m3.doubleSided);
        assert.equal(m4.alphaCutoff, m3.alphaCutoff);
        assert.equal(m4.alphaMode, m3.alphaMode);
        assert.equal(m4.metallicFactor, m3.metallicFactor);
        assert.equal(m4.baseColor?.length, m3.baseColor?.length);
        assert.equal(m4.baseColor?.[0], m3.baseColor?.[0]);
        assert.equal(m4.baseColor?.[1], m3.baseColor?.[1]);
        assert.equal(m4.baseColor?.[2], m3.baseColor?.[2]);
        assert.equal(m4.baseColor?.[3], m3.baseColor?.[3]);
        assert.equal(m4.emissiveFactor?.length, m3.emissiveFactor?.length);
        assert.equal(m4.emissiveFactor?.[0], m3.emissiveFactor?.[0]);
        assert.equal(m4.emissiveFactor?.[1], m3.emissiveFactor?.[1]);
        assert.equal(m4.emissiveFactor?.[2], m3.emissiveFactor?.[2]);
        assert.equal(m4.textures?.length, m3.textures?.length);
        assert.equal(m4.textures?.[0], m3.textures?.[0]);
        assert.equal(m4.textures?.[1], m3.textures?.[1]);
        assert.equal(m4.textures?.[2], m3.textures?.[2]);
        assert.equal(m4.textures?.[3], m3.textures?.[3]);
        assert.equal(m4.textureTransforms?.length, m3.textureTransforms?.length);
        assert.equal(m4.textureTransforms?.[0]?.offset?.[0], m3.textureTransforms?.[0]?.offset?.[0]);
        assert.equal(m4.textureTransforms?.[0]?.offset?.[1], m3.textureTransforms?.[0]?.offset?.[1]);
        assert.equal(m4.textureTransforms?.[0]?.scale?.[0], m3.textureTransforms?.[0]?.scale?.[0]);
        assert.equal(m4.textureTransforms?.[0]?.scale?.[1], m3.textureTransforms?.[0]?.scale?.[1]);
        assert.equal(m4.textureTransforms?.[0]?.rotation, m3.textureTransforms?.[0]?.rotation);

        assert.equal(m4.textureTransforms?.[1]?.offset?.[0], m3.textureTransforms?.[1]?.offset?.[0]);
        assert.equal(m4.textureTransforms?.[1]?.offset?.[1], m3.textureTransforms?.[1]?.offset?.[1]);
        assert.equal(m4.textureTransforms?.[1]?.scale?.[0], m3.textureTransforms?.[1]?.scale?.[0]);
        assert.equal(m4.textureTransforms?.[1]?.scale?.[1], m3.textureTransforms?.[1]?.scale?.[1]);
        assert.equal(m4.textureTransforms?.[1]?.rotation, m3.textureTransforms?.[1]?.rotation);


        assert.equal(m4.textureTransforms?.[2]?.offset?.[0], m3.textureTransforms?.[2]?.offset?.[0]);
        assert.equal(m4.textureTransforms?.[2]?.offset?.[1], m3.textureTransforms?.[2]?.offset?.[1]);
        assert.equal(m4.textureTransforms?.[2]?.scale?.[0], m3.textureTransforms?.[2]?.scale?.[0]);
        assert.equal(m4.textureTransforms?.[2]?.scale?.[1], m3.textureTransforms?.[2]?.scale?.[1]);
        assert.equal(m4.textureTransforms?.[2]?.rotation, m3.textureTransforms?.[2]?.rotation);

        assert.equal(m4.textureTransforms?.[3]?.offset?.[0], m3.textureTransforms?.[3]?.offset?.[0]);
        assert.equal(m4.textureTransforms?.[3]?.offset?.[1], m3.textureTransforms?.[3]?.offset?.[1]);
        assert.equal(m4.textureTransforms?.[3]?.scale?.[0], m3.textureTransforms?.[3]?.scale?.[0]);
        assert.equal(m4.textureTransforms?.[3]?.scale?.[1], m3.textureTransforms?.[3]?.scale?.[1]);
        assert.equal(m4.textureTransforms?.[3]?.rotation, m3.textureTransforms?.[3]?.rotation);
    });
});

