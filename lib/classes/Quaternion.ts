import {quat} from '../tsm/quat';

export class Quaternion extends quat
{
    static getIdentity(): Quaternion
    {
        const q = new Quaternion();
        q.setIdentity();
        return q;
    }

    constructor(buf?: Buffer | number[], pos?: number)
    {
        if (buf !== undefined && pos !== undefined && buf instanceof Buffer)
        {
            const x = buf.readFloatLE(pos);
            const y = buf.readFloatLE(pos + 4);
            const z = buf.readFloatLE(pos + 8);
            const xyzsum = 1.0 - x * x - y * y - z * z;
            const w = (xyzsum > 0.0) ? Math.sqrt(xyzsum) : 0;
            super([x, y, z, w]);
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
    writeToBuffer(buf: Buffer, pos: number)
    {
        const q: quat = this.normalize();
        buf.writeFloatLE(q.x, pos);
        buf.writeFloatLE(q.y, pos + 4);
        buf.writeFloatLE(q.z, pos + 8);
    }
}
