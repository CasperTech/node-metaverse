import {Vector3} from '../Vector3';

export class FlexibleData
{
    Softness = 0;
    Tension = 0.0;
    Drag = 0.0;
    Gravity = 0.0;
    Wind = 0.0;
    Force = Vector3.getZero();

    constructor(buf?: Buffer, pos?: number, length?: number)
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
    writeToBuffer(buf: Buffer, pos: number)
    {
        buf[pos] = (this.Softness & 2) << 6;
        buf[pos + 1] = (this.Softness & 1) << 7;
        buf[pos++] |= ((this.Tension * 10) & 0x7F);
        buf[pos++] |= ((this.Drag * 10) & 0x7F);
        buf[pos++] = (this.Gravity + 10.0) * 10.0;
        buf[pos++] = (this.Wind) * 10;
        this.Force.writeToBuffer(buf, pos, false);
    }
}
