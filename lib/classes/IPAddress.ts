import * as ipaddr from 'ipaddr.js'
import type { IPv4, IPv6 } from 'ipaddr.js';

export class IPAddress
{
    public ip: IPv4 | IPv6 | null = null;

    public constructor(buf?: Buffer | string, pos?: number)
    {
        try
        {
            if (buf !== undefined && buf instanceof Buffer)
            {
                if (pos !== undefined)
                {
                    const bytes = buf.subarray(pos, 4);
                    this.ip = ipaddr.fromByteArray(Array.from(bytes));
                }
                else if (typeof buf === 'string')
                {
                    if (ipaddr.isValid(buf))
                    {
                        this.ip = ipaddr.parse(buf);
                    }
                    else
                    {
                        throw new Error('Invalid IP address');
                    }
                }
            }
            else if (typeof buf === 'string')
            {
                if (ipaddr.isValid(buf))
                {
                    this.ip = ipaddr.parse(buf);
                }
                else
                {
                    throw new Error('Invalid IP address');
                }
            }
        }
        catch (_ignore: unknown)
        {
            this.ip = ipaddr.parse('0.0.0.0');
        }
    }

    public static zero(): IPAddress
    {
        return new IPAddress('0.0.0.0');
    }

    public toString = (): string =>
    {
        if (!this.ip)
        {
            return '';
        }
        return this.ip.toString();
    };


    public writeToBuffer(buf: Buffer, pos: number): void
    {
        if (!this.ip)
        {
            throw new Error('Invalid IP');
        }
        const bytes: number[] = this.ip.toByteArray();
        buf.writeUInt8(bytes[0], pos++);
        buf.writeUInt8(bytes[1], pos++);
        buf.writeUInt8(bytes[2], pos++);
        buf.writeUInt8(bytes[3], pos);
    }
}
