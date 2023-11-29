import validator from 'validator';
import * as Long from 'long';
import { XMLNode } from 'xmlbuilder';
import * as uuid from 'uuid';

export class UUID
{
    private mUUID = '00000000-0000-0000-0000-000000000000';

    public static zero(): UUID
    {
        return new UUID();
    }
    public static random(): UUID
    {
        const newUUID = uuid.v4();
        return new UUID(newUUID);
    }

    public static getString(u?: UUID): string
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

    public static getXML(doc: XMLNode, u?: UUID): void
    {
        const str = UUID.getString(u);
        doc.ele('UUID', str);
    }

    public static fromXMLJS(obj: any, param: string): false | UUID
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

    public constructor(buf?: Buffer | string, pos?: number)
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
                this.setUUID(hexString.substring(0, 8) + '-'
                    + hexString.substring(8, 12) + '-'
                    + hexString.substring(12, 16) + '-'
                    + hexString.substring(16, 20) + '-'
                    + hexString.substring(20, 32));
            }
            else if (typeof buf === 'object' && buf.toString !== undefined)
            {
                this.setUUID(buf.toString());
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

    public writeToBuffer(buf: Buffer, pos: number): void
    {
        const shortened = this.mUUID.substring(0, 8) + this.mUUID.substring(9, 13) + this.mUUID.substring(14, 18) + this.mUUID.substring(19, 23) + this.mUUID.substring(24, 36);
        const binary = Buffer.from(shortened, 'hex');
        binary.copy(buf, pos, 0);
    }

    public isZero(): boolean
    {
        return (this.mUUID === '00000000-0000-0000-0000-000000000000');
    }

    public equals(cmp: UUID | string): boolean
    {
        if (typeof cmp === 'string')
        {
            return (cmp === this.mUUID);
        }
        else
        {
            if (cmp.equals === undefined)
            {
                throw new Error(cmp.constructor.name + ' is not a UUID');
            }
            return cmp.equals(this.mUUID);
        }
    }

    public getBuffer(): Buffer
    {
        const buf = Buffer.allocUnsafe(16);
        this.writeToBuffer(buf, 0);
        return buf;
    }

    public getLong(): Long
    {
        const buf = this.getBuffer();
        return new Long(buf.readUInt32LE(7), buf.readUInt32LE(12));
    }

    public bitwiseXor(w: UUID): UUID
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
        const bytes: Buffer = this.getBuffer();
        const crcOne = ((bytes[3] << 24 >>> 0) + (bytes[2] << 16 >>> 0) + (bytes[1] << 8 >>> 0) + bytes[0]);
        const crcTwo = ((bytes[7] << 24 >>> 0) + (bytes[6] << 16 >>> 0) + (bytes[5] << 8 >>> 0) + bytes[4]);
        const crcThree =  ((bytes[11] << 24 >>> 0) + (bytes[10] << 16 >>> 0) + (bytes[9] << 8 >>> 0) + bytes[8]);
        const crcFour = ((bytes[15] << 24 >>> 0) + (bytes[14] << 16 >>> 0) + (bytes[13] << 8 >>> 0) + bytes[12]);
        return crcOne + crcTwo + crcThree + crcFour >>> 0;
    }
}
