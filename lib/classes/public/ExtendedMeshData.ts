import { ExtendedMeshFlags } from './ExtendedMeshFlags';

export class ExtendedMeshData
{
    public flags: ExtendedMeshFlags = 0 as ExtendedMeshFlags;

    constructor(buf?: Buffer, pos?: number, length?: number)
    {
        if (buf !== undefined && pos !== undefined && length !== undefined)
        {
            if (buf.length - pos >= 4 && length >= 4)
            {
                this.flags = buf.readUInt32LE(pos);
            }
        }
    }

    writeToBuffer(buf: Buffer, pos: number): void
    {
        buf.writeUInt32LE(this.flags, pos);
    }

    getBuffer(): Buffer
    {
        const buf = Buffer.allocUnsafe(4);
        this.writeToBuffer(buf, 0);
        return buf;
    }
}
