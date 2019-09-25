import * as validator from 'validator';
import * as Long from 'long';
import {XMLNode} from 'xmlbuilder';
const uuid = require('uuid');

export class UUID
{
    private mUUID = '00000000-0000-0000-0000-000000000000';

    static zero(): UUID
    {
        return new UUID();
    }
    static random(): UUID
    {
        const newUUID = uuid.v4();
        return new UUID(newUUID);
    }

    static getString(u?: UUID): string
    {
        if (u === undefined)
        {
            return UUID.zero().toString();
        }
        else
        {
            return u.toString();
        }
    }

    static getXML(doc: XMLNode, u?: UUID)
    {
        const str = UUID.getString(u);
        doc.ele('UUID', str);
    }

    static fromXMLJS(obj: any, param: string): false | UUID
    {
        if (obj[param] === undefined)
        {
            return false;
        }
        if (Array.isArray(obj[param]) && obj[param].length > 0)
        {
            obj[param] = obj[param][0];
        }
        if (typeof obj[param] === 'string')
        {
            if (validator.isUUID(obj[param]))
            {
                return new UUID(obj[param]);
            }
            return false;
        }
        if (typeof obj[param] === 'object')
        {
            if (obj[param]['UUID'] !== undefined && Array.isArray(obj[param]['UUID']) && obj[param]['UUID'].length > 0)
            {
                const u = obj[param]['UUID'][0];
                if (typeof u === 'string')
                {
                    if (validator.isUUID(u))
                    {
                        return new UUID(u);
                    }
                    return false;
                }
                return false;
            }
            return false;
        }
        return false;
    }

    constructor(buf?: Buffer | string, pos?: number)
    {
        if (buf !== undefined)
        {
            if (typeof buf === 'string')
            {
                this.setUUID(buf);
            }
            else if (pos !== undefined)
            {
                const uuidBuf: Buffer = buf.slice(pos, pos + 16);
                const hexString = uuidBuf.toString('hex');
                this.setUUID(hexString.substr(0, 8) + '-'
                    + hexString.substr(8, 4) + '-'
                    + hexString.substr(12, 4) + '-'
                    + hexString.substr(16, 4) + '-'
                    + hexString.substr(20, 12));
            }
            else
            {
                console.error('Can\'t accept UUIDs of type ' + typeof buf);
            }
        }
    }

    public setUUID(val: string): boolean
    {
        const test = val.trim();
        if (validator.isUUID(test))
        {
            this.mUUID = test;
            return true;
        }
        else
        {
            console.log('Invalid UUID: ' + test + ' (length ' + val.length + ')');
        }
        return false;
    }

    public toString = (): string =>
    {
        return this.mUUID;
    };

    writeToBuffer(buf: Buffer, pos: number)
    {
        const shortened = this.mUUID.substr(0, 8) + this.mUUID.substr(9, 4) + this.mUUID.substr(14, 4) + this.mUUID.substr(19, 4) + this.mUUID.substr(24, 12);
        const binary = Buffer.from(shortened, 'hex');
        binary.copy(buf, pos, 0);
    }

    public equals(cmp: UUID | string): boolean
    {
        if (typeof cmp === 'string')
        {
            return (cmp === this.mUUID);
        }
        else
        {
            return cmp.equals(this.mUUID);
        }
    }

    public getBuffer()
    {
        const buf = Buffer.allocUnsafe(16);
        this.writeToBuffer(buf, 0);
        return buf;
    }

    public getLong()
    {
        const buf = this.getBuffer();
        return new Long(buf.readUInt32LE(7), buf.readUInt32LE(12));
    }

    public bitwiseOr(w: UUID): UUID
    {
        const buf1 = this.getBuffer();
        const buf2 = w.getBuffer();
        const buf3 = Buffer.allocUnsafe(16);
        for (let x = 0; x < 16; x++)
        {
            buf3[x] = buf1[x] ^ buf2[x];
        }
        return new UUID(buf3, 0);
    }

    public CRC(): number
    {
        let retval = 0;
        const bytes: Buffer = this.getBuffer();

        retval += ((bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0]);
        retval += ((bytes[7] << 24) + (bytes[6] << 16) + (bytes[5] << 8) + bytes[4]);
        retval += ((bytes[11] << 24) + (bytes[10] << 16) + (bytes[9] << 8) + bytes[8]);
        retval += ((bytes[15] << 24) + (bytes[14] << 16) + (bytes[13] << 8) + bytes[12]);

        return retval;
    }
}
