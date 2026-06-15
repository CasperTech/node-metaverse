import * as LLSD from '@caspertech/llsd';
import type { LLGLTFMaterialData } from './LLGLTFMaterialData';
 
export class LLGLTFMaterial
{
    public type?: string;
    public version?: string;
    public data?: LLGLTFMaterialData;

    public constructor(data?: Buffer)
    {
        if (data !== undefined)
        {
            const result = LLGLTFMaterial.parseEnvelope(data);
            if (result === undefined || result === null)
            {
                throw new Error('Failed to decode LLGLTFMaterial');
            }
            if (result.type)
            {
                this.type = String(result.type as unknown);
            }
            if (result.version)
            {
                this.version = String(result.version as unknown);
            }
            if (result.data)
            {
                const assetData = String(result.data as unknown);
                this.data = JSON.parse(assetData);
            }
        }
    }

    private static parseEnvelope(data: Buffer): { type?: unknown; version?: unknown; data?: unknown } | undefined
    {
        const newline = data.indexOf(0x0a);
        const marker = newline >= 0 ? data.subarray(0, newline).toString('utf-8').replace(/\s+/g, '').toLowerCase() : '';
        if (marker === '<?llsd/binary?>')
        {
            const body = new LLSD.Binary(Array.from(data.subarray(newline + 1)), 'BINARY');
            const llsd = LLSD.LLSD.parseBinary(body);
            return llsd?.result as { type?: unknown; version?: unknown; data?: unknown };
        }

        const text = data.toString('utf-8').trimStart();
        if (text.startsWith('<'))
        {
            return LLSD.LLSD.parseXML(text) as { type?: unknown; version?: unknown; data?: unknown };
        }

        throw new Error('Failed to parse LLGLTFMaterial');
    }
}
