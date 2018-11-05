import {XMLElementOrXMLNode} from 'xmlbuilder';
import {Utils} from './Utils';

export class Color4
{
    static black: Color4 = new Color4(0.0, 0.0, 0.0, 1.0);
    static white: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);

    static getXML(doc: XMLElementOrXMLNode, c?: Color4)
    {
        if (c === undefined)
        {
            c = Color4.white;
        }
        doc.ele('R', c.red);
        doc.ele('G', c.green);
        doc.ele('B', c.blue);
        doc.ele('A', c.alpha);
    }

    static fromXMLJS(obj: any, param: string): Color4 | false
    {
        if (!obj[param])
        {
            return false;
        }
        let value = obj[param];
        if (Array.isArray(value) && value.length > 0)
        {
            value = value[0];
        }
        if (typeof value === 'object')
        {
            if (value['R'] !== undefined && value['G'] !== undefined && value['B'] !== undefined && value['A'] !== undefined)
            {
                let red = value['R'];
                let green = value['G'];
                let blue = value['B'];
                let alpha = value['A'];
                if (Array.isArray(red) && red.length > 0)
                {
                    red = red[0];
                }
                if (Array.isArray(green) && green.length > 0)
                {
                    green = green[0];
                }
                if (Array.isArray(blue) && blue.length > 0)
                {
                    blue = blue[0];
                }
                if (Array.isArray(alpha) && alpha.length > 0)
                {
                    alpha = alpha[0];
                }
                return new Color4(red, green, blue, alpha);
            }
            return false;
        }
        return false;
    }

    constructor(public red: number | Buffer | number[], public green: number = 0, public blue: number | boolean = 0, public alpha: number | boolean = 0)
    {
        if (red instanceof Buffer && typeof blue === 'boolean')
        {
            const buf = red;
            const pos = green;
            const inverted = blue;
            let alphaInverted = false;
            if (typeof alpha === 'boolean' && alpha === true)
            {
                alphaInverted = true;
            }

            this.red = 0.0;
            this.green = 0.0;
            this.blue = 0.0;
            this.alpha = 0.0;

            const quanta: number = 1.0 / 255.0;
            if (inverted)
            {
                this.red = (255 - buf[pos]) * quanta;
                this.green = (255 - buf[pos + 1]) * quanta;
                this.blue = (255 - buf[pos + 2]) * quanta;
                this.alpha = (255 - buf[pos + 3]) * quanta;
            }
            else
            {
                this.red = buf[pos] * quanta;
                this.green = buf[pos + 1] * quanta;
                this.blue = buf[pos + 2] * quanta;
                this.alpha = buf[pos + 3] * quanta;
            }
            if (alphaInverted)
            {
                this.alpha = 1.0 - this.alpha;
            }
        }
        if (Array.isArray(red))
        {
            this.green = red[1];
            this.blue = red[2];
            this.alpha = red[3];
            this.red = red[0];
        }
    }
    getRed(): number
    {
        if (typeof this.red === 'number')
        {
            return this.red;
        }
        return 0;
    }
    getGreen(): number
    {
        if (typeof this.green === 'number')
        {
            return this.green;
        }
        return 0;
    }
    getBlue(): number
    {
        if (typeof this.blue === 'number')
        {
            return this.blue;
        }
        return 0;
    }
    getAlpha(): number
    {
        if (typeof this.alpha === 'number')
        {
            return this.alpha;
        }
        return 0;
    }

    writeToBuffer(buf: Buffer, pos: number)
    {
        buf.writeUInt8(Utils.FloatToByte(this.getRed(), 0, 1.0), pos++);
        buf.writeUInt8(Utils.FloatToByte(this.getGreen(), 0, 1.0), pos++);
        buf.writeUInt8(Utils.FloatToByte(this.getBlue(), 0, 1.0), pos++);
        buf.writeUInt8(Utils.FloatToByte(this.getAlpha(), 0, 1.0), pos);
    }
}
