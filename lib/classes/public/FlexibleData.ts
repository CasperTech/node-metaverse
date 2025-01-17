import { Vector3 } from '../Vector3';

export class FlexibleData
{
    public Softness = 0;
    public Tension = 0.0;
    public Drag = 0.0;
    public Gravity = 0.0;
    public Wind = 0.0;
    public Force = Vector3.getZero();

    public constructor(buf?: Buffer, pos?: number, length?: number)
    {
        if (buf !== undefined && pos !== undefined && length !== undefined)
        {
            if (length >= 5)
            {
                this.Softness = ((buf.readUInt8(pos) & 0x80) >> 6) | ((buf.readUInt8(pos + 1) & 0x80) >> 7);
                this.Tension = (buf.readUInt8(pos++) & 0x7F) / 10.0;
                this.Drag = (buf.readUInt8(pos++) & 0x7F) / 10.0;
                this.Gravity = (buf.readUInt8(pos++) / 10.0) - 10.0;
                this.Wind = (buf.readUInt8(pos++) / 10.0);
                this.Force = new Vector3(buf, pos);
            }
        }
    }

    public writeToBuffer(buf: Buffer, pos: number): void
    {
        buf[pos] = (this.Softness & 2) << 6;
        buf[pos + 1] = (this.Softness & 1) << 7;
        buf[pos++] |= ((this.Tension * 10) & 0x7F);
        buf[pos++] |= ((this.Drag * 10) & 0x7F);
        buf[pos++] = (this.Gravity + 10.0) * 10.0;
        buf[pos++] = (this.Wind) * 10;
        this.Force.writeToBuffer(buf, pos, false);
    }

    public getBuffer(): Buffer
    {
        const buf = Buffer.allocUnsafe(16);
        this.writeToBuffer(buf, 0);
        return buf;
    }
}
