import {vec2} from '../tsm/vec2';

export class Vector2 extends vec2
{
    static getZero(): Vector2
    {
        return new Vector2();
    }

    constructor(buf?: Buffer | number[], pos?: number, double?: boolean)
    {
        if (double === undefined)
        {
            double = false;
        }
        if (buf !== undefined && pos !== undefined && buf instanceof Buffer)
        {
            if (!double)
            {
                const x = buf.readFloatLE(pos);
                const y = buf.readFloatLE(pos + 4);
                super([x, y]);
            }
            else
            {
                const x = buf.readDoubleLE(pos);
                const y = buf.readDoubleLE(pos + 8);
                super([x, y]);
            }
        }
        else if (buf !== undefined && Array.isArray(buf))
        {
            super(buf);
        }
        else
        {
            super();
        }
    }
    writeToBuffer(buf: Buffer, pos: number, double: boolean)
    {
        if (double)
        {
            buf.writeDoubleLE(this.x, pos);
            buf.writeDoubleLE(this.y, pos + 8);
        }
        else
        {
            buf.writeFloatLE(this.x, pos);
            buf.writeFloatLE(this.y, pos + 4);
        }
    }
    toString(): string
    {
        return '<' + this.x + ', ' + this.y + '>';
    }
}
