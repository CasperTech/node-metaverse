import {vec4} from '../tsm/vec4';
import {XMLElementOrXMLNode} from 'xmlbuilder';

export class Vector4 extends vec4
{
    static getZero(): Vector4
    {
        return new Vector4();
    }

    static getXML(doc: XMLElementOrXMLNode, v?: Vector4)
    {
        if (v === undefined)
        {
            v = Vector4.getZero();
        }
        doc.ele('X', v.x);
        doc.ele('Y', v.y);
        doc.ele('Z', v.z);
        doc.ele('W', v.w);
    }

    constructor(buf?: Buffer | number[], pos?: number)
    {
        if (buf !== undefined && pos !== undefined && buf instanceof Buffer)
        {
            const x = buf.readFloatLE(pos);
            const y = buf.readFloatLE(pos + 4);
            const z = buf.readFloatLE(pos + 8);
            const w = buf.readFloatLE(pos + 12);
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
        buf.writeFloatLE(this.x, pos);
        buf.writeFloatLE(this.y, pos + 4);
        buf.writeFloatLE(this.z, pos + 8);
        buf.writeFloatLE(this.w, pos + 12);
    }
    toString(): string
    {
        return '<' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + '>';
    }
}
