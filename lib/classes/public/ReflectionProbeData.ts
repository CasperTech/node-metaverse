import { ReflectionProbeFlags } from './ReflectionProbeFlags';

export class ReflectionProbeData
{
    public ambiance = 0.0;
    public clipDistance = 0.0;
    public flags: ReflectionProbeFlags = 0 as ReflectionProbeFlags;

    constructor(buf?: Buffer, pos?: number, length?: number)
    {
        if (buf !== undefined && pos !== undefined && length !== undefined)
        {
            if (buf.length - pos >= 9 && length >= 9)
            {
                this.ambiance = buf.readFloatLE(pos);
                pos = pos + 4;
                this.clipDistance = buf.readFloatLE(pos);
                pos = pos + 4;
                this.flags = buf.readUInt8(pos);
            }
        }
    }

    writeToBuffer(buf: Buffer, pos: number): void
    {
        buf.writeFloatLE(this.ambiance, pos);
        pos = pos + 4;
        buf.writeFloatLE(this.clipDistance, pos);
        pos = pos + 4;
        buf.writeUInt8(this.flags, pos);
    }

    getBuffer(): Buffer
    {
        const buf = Buffer.allocUnsafe(9);
        this.writeToBuffer(buf, 0);
        return buf;
    }
}
