import * as LLSD from '@caspertech/llsd';
import { LLGLTFMaterialData } from './LLGLTFMaterialData';

export class LLGLTFMaterial
{
    public type?: string;
    public version?: string;
    public data?: LLGLTFMaterialData;

    public constructor(data?: Buffer)
    {
        if (data !== undefined)
        {
            const header = data.slice(0, 18).toString('utf-8');
            if (header.length !== 18 || header !== '<? LLSD/Binary ?>\n')
            {
                throw new Error('Failed to parse LLGLTFMaterial');
            }

            const body = new LLSD.Binary(Array.from(data.slice(18)), 'BINARY');
            const llsd = LLSD.LLSD.parseBinary(body);
            if (!llsd.result)
            {
                throw new Error('Failed to decode LLGLTFMaterial');
            }
            if (llsd.result.type)
            {
                this.type = String(llsd.result.type);
            }
            if (llsd.result.version)
            {
                this.version = String(llsd.result.version);
            }
            if (llsd.result.data)
            {
                const assetData = String(llsd.result.data);
                this.data = JSON.parse(assetData);
            }
        }
    }
}
