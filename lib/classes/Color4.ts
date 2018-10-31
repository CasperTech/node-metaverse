import {XMLElementOrXMLNode} from 'xmlbuilder';

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
}
