import {vec3} from '../tsm/vec3';

export class Vector3 extends vec3
{
    static getZero(): Vector3
    {
        return new Vector3();
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
                const z = buf.readFloatLE(pos + 8);
                super([x, y, z]);
            }
            else
            {
                const x = buf.readDoubleLE(pos);
                const y = buf.readDoubleLE(pos + 8);
                const z = buf.readDoubleLE(pos + 16);
                super([x, y, z]);
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
            buf.writeDoubleLE(this.x, pos + 16);
        }
        else
        {
            buf.writeFloatLE(this.x, pos);
            buf.writeFloatLE(this.y, pos + 4);
            buf.writeFloatLE(this.x, pos + 8);
        }
    }
}
