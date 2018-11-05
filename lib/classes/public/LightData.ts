import {Color4} from '../Color4';
import {Utils} from '../Utils';

export class LightData
{
    Color: Color4 = Color4.black;
    Radius = 0.0;
    Cutoff = 0.0;
    Falloff = 0.0;
    Intensity = 0.0;

    constructor(buf?: Buffer, pos?: number, length?: number)
    {
        if (buf !== undefined && pos !== undefined && length !== undefined)
        {
            if (length >= 16)
            {
                this.Color = new Color4(buf, pos, false);
                pos += 4;
                this.Radius = buf.readFloatLE(pos);
                pos += 4;
                this.Cutoff = buf.readFloatLE(pos);
                pos += 4;
                this.Falloff = buf.readFloatLE(pos);
                if (typeof this.Color.alpha === 'number')
                {
                    this.Intensity = this.Color.alpha;
                }
                this.Color.alpha = 1.0;
            }
        }
    }
    writeToBuffer(buf: Buffer, pos: number)
    {
        const tmpColour = new Color4(this.Color.getRed(), this.Color.getGreen(), this.Color.getBlue(), this.Color.getAlpha());
        tmpColour.alpha = this.Intensity;
        tmpColour.writeToBuffer(buf, pos); pos = pos + 4;
        buf.writeFloatLE(this.Radius, pos); pos = pos + 4;
        buf.writeFloatLE(this.Cutoff, pos); pos = pos + 4;
        buf.writeFloatLE(this.Falloff, pos);
    }
}
