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
                this.mUUID = uuid.unparse(buf, pos);
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
        uuid.parse(this.mUUID, buf, pos);
    }
}
