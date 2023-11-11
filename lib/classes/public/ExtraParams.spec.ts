import { ExtraParams } from './ExtraParams';
import * as assert from 'assert';

const b64string = 'AmAAEQAAAC2I07gMc7AzeOCdhL1CricFgAASAAAAAQDzztZj0h5LaIn/xt8fChDC';
const paramsBuf = Buffer.from(b64string, 'base64');

describe('ExtraParams', () =>
{
    it('Can load and params to/from base64', async() =>
    {
        const p = ExtraParams.from(paramsBuf);
        if (p.renderMaterialData)
        {
            assert.equal(p.renderMaterialData.params.length, 1);
            assert.equal(p.renderMaterialData.params[0].textureUUID, 'f3ced663-d21e-4b68-89ff-c6df1f0a10c2');
            assert.equal(p.renderMaterialData.params[0].textureIndex, 0);
        }
        else
        {
            assert(false, 'RenderMaterialData is missing');
        }
        const b64 = p.toBase64();
        assert.equal(b64, b64string);
    });
});

