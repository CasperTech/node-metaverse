import {vec3} from '../tsm/vec3';
import {XMLElementOrXMLNode} from 'xmlbuilder';

export class Vector3 extends vec3
{
    static getZero(): Vector3
    {
        return new Vector3();
    }

    static getXML(doc: XMLElementOrXMLNode, v?: Vector3)
    {
        if (v === undefined)
        {
            v = Vector3.getZero();
        }
        doc.ele('X', v.x);
        doc.ele('Y', v.y);
        doc.ele('Z', v.z);
    }

    static fromXMLJS(obj: any, param: string): Vector3 | false
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
            if (value['X'] !== undefined && value['Y'] !== undefined && value['Z'] !== undefined)
            {
                let x = value['X'];
                let y = value['Y'];
                let z = value['Z'];
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
                return new Vector3([x, y, z]);
            }
            return false;
        }
        return false;
    }

    constructor(buf?: Buffer | number[] | Vector3, pos?: number, double?: boolean)
    {
        if (buf instanceof Vector3)
        {
            super();
            this.x = buf.x;
            this.y = buf.y;
            this.z = buf.z;
        }
        else
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
    }
    writeToBuffer(buf: Buffer, pos: number, double: boolean)
    {
        if (double)
        {
            buf.writeDoubleLE(this.x, pos);
            buf.writeDoubleLE(this.y, pos + 8);
            buf.writeDoubleLE(this.z, pos + 16);
        }
        else
        {
            buf.writeFloatLE(this.x, pos);
            buf.writeFloatLE(this.y, pos + 4);
            buf.writeFloatLE(this.z, pos + 8);
        }
    }
    toString(): string
    {
        return '<' + this.x + ', ' + this.y + ', ' + this.z + '>';
    }


}
