import {Color4} from '../Color4';
import {Utils} from '../Utils';

export class LightData
{
    Color: Color4 = Color4.black;
    Radius = 0.0;
    Cutoff = 0.0;
    Falloff = 0.0;
    Intensity = 0.0;

    constructor(buf: Buffer, pos: number, length: number)
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
