const ipaddr = require('ipaddr.js');

export class IPAddress
{
    ip: any = null;

    static zero(): IPAddress
    {
        return new IPAddress('0.0.0.0');
    }
    public toString = (): string =>
    {
        try
        {
            return this.ip.toString();
        }
        catch (ignore)
        {
            return '';
        }
    };
    constructor(buf?: Buffer | string, pos?: number)
    {
        try
        {
            if (buf !== undefined && buf instanceof Buffer)
            {
                if (pos !== undefined)
                {
                    const bytes = buf.slice(pos, 4);
                    this.ip = ipaddr.fromByteArray(bytes);
                }
                else
                {
                    if (ipaddr.isValid(buf))
                    {
                        this.ip = ipaddr.parse(buf);
                    }
                }
            }
        }
        catch (ignore)
        {
            this.ip = ipaddr.parse('0.0.0.0');
        }
    }
    writeToBuffer(buf: Buffer, pos: number)
    {
        const bytes: Uint8Array = this.ip.toByteArray();
        buf.writeUInt8(bytes[0], pos++);
        buf.writeUInt8(bytes[1], pos++);
        buf.writeUInt8(bytes[2], pos++);
        buf.writeUInt8(bytes[3], pos);
    }
}
