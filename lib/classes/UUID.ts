import * as validator from 'validator';
const uuid = require('uuid');

export class UUID
{
    private mUUID = '00000000-0000-0000-0000-000000000000';

    static zero(): UUID
    {
        return new UUID();
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
        }
    }

    public setUUID(val: string): boolean
    {
        if (validator.isUUID(val, 4))
        {
            this.mUUID = val;
            return true;
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
