import { RenderMaterialParam } from './RenderMaterialParam';
import { UUID } from '../UUID';

export class RenderMaterialData
{
    public params: RenderMaterialParam[] = [];

    constructor(buf?: Buffer, pos?: number, length?: number)
    {
        let localPos = 0;
        if (buf !== undefined && pos !== undefined && length !== undefined)
        {
            if (buf.length - pos >= 1 && length - localPos >= 1)
            {
                const count = buf.readUInt8(pos++);
                localPos++;
                for (let x = 0; x < count; x++)
                {
                    if (buf.length - pos >= 17 && length - localPos >= 17)
                    {
                        const param = new RenderMaterialParam();
                        param.textureIndex = buf.readUInt8(pos++);
                        localPos++;
                        param.textureUUID = new UUID(buf, pos);
                        pos = pos + 16;
                        localPos = localPos + 16;
                        this.params.push(param);
                    }
                }
            }
        }
    }

    writeToBuffer(buf: Buffer, pos: number): void
    {
        buf.writeUInt8(this.params.length, pos++);
        for (const param of this.params)
        {
            buf.writeUInt8(param.textureIndex, pos++);
            param.textureUUID.writeToBuffer(buf, pos);
            pos = pos + 16;
        }
    }

    getBuffer(): Buffer
    {
        const buf = Buffer.allocUnsafe(1 + (this.params.length * 17));
        this.writeToBuffer(buf, 0);
        return buf;
    }
}
