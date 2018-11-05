import {quat} from '../tsm/quat';
import {XMLElementOrXMLNode} from 'xmlbuilder';

export class Quaternion extends quat
{
    static getIdentity(): Quaternion
    {
        const q = new Quaternion();
        q.setIdentity();
        return q;
    }

    static getXML(doc: XMLElementOrXMLNode, v?: Quaternion)
    {
        if (v === undefined)
        {
            v = Quaternion.getIdentity();
        }
        doc.ele('X', v.x);
        doc.ele('Y', v.y);
        doc.ele('Z', v.z);
        doc.ele('W', v.w);
    }

    static fromXMLJS(obj: any, param: string): Quaternion | false
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
            if (value['X'] !== undefined && value['Y'] !== undefined && value['Z'] !== undefined && value['W'] !== undefined)
            {
                let x = value['X'];
                let y = value['Y'];
                let z = value['Z'];
                let w = value['W'];
                if (Array.isArray(x) && x.length > 0)
                {
                    x = x[0];
                }
                if (Array.isArray(y) && y.length > 0)
                {
                    y = y[0];
                }
                if (Array.isArray(z) && z.length > 0)
                {
                    z = z[0];
                }
                if (Array.isArray(w) && w.length > 0)
                {
                    w = w[0];
                }
                return new Quaternion([x, y, z, w]);
            }
            return false;
        }
        return false;
    }

    constructor(buf?: Buffer | number[] | Quaternion, pos?: number)
    {
        if (buf instanceof Quaternion)
        {
            super();
            this.x = buf.x;
            this.y = buf.y;
            this.z = buf.z;
            this.w = buf.w;
        }
        else
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
    }
    writeToBuffer(buf: Buffer, pos: number)
    {
        const q: quat = this.normalize();
        buf.writeFloatLE(q.x, pos);
        buf.writeFloatLE(q.y, pos + 4);
        buf.writeFloatLE(q.z, pos + 8);
    }
    toString(): string
    {
        return '<' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + '>';
    }
}
