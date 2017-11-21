import * as validator from 'validator';

export class UUID
{
    private mUUID = '00000000-0000-0000-0000-000000000000';

    static zero(): UUID
    {
        return new UUID();
    }

    constructor(val?: string)
    {
        if (val !== undefined)
        {
            this.setUUID(val);
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
    }
}
