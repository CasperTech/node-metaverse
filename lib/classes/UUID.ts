import * as validator from 'validator';
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
                console.trace();
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
}
