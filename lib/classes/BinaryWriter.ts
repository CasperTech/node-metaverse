import type { UUID } from "./UUID";
import type { Vector3 } from './Vector3';
 
export class BinaryWriter
{
    public segments: Buffer[] = [];

    public length(): number
    {
        let size = 0;
        for (const seg of this.segments)
        {
            size += seg.length;
        }
        return size;
    }

    public writeBuffer(buf: Buffer, start = 0, end = buf.length): void
    {
        this.segments.push(buf.subarray(start, end));
    }

    public writeVarInt(value: number | bigint): void
    {
        // noinspection JSUnusedAssignment
        let n = 0n;
        if (typeof value === 'number')
        {
            n = BigInt(value);
        }
        else
        {
            n = value;
        }
        const encoded = (n << 1n) ^ (n < 0n ? -1n : 0n);
        const bytes: number[] = [];
        let remaining = encoded;

        while (remaining >= 0x80n)
        {
            bytes.push(Number((remaining & 0x7Fn) | 0x80n));
            remaining >>= 7n;
        }
        bytes.push(Number(remaining));
        const encodedBuffer = Buffer.from(bytes);
        this.writeBuffer(encodedBuffer);
    }

    public get(): Buffer
    {
        return Buffer.concat(this.segments);
    }

    // Write Methods

    public writeUInt8(value: number): void
    {
        const buf = Buffer.allocUnsafe(1);
        buf.writeUInt8(value, 0);
        this.segments.push(buf);
    }

    public writeInt8(value: number): void
    {
        const buf = Buffer.allocUnsafe(1);
        buf.writeInt8(value, 0);
        this.segments.push(buf);
    }

    public writeUInt16LE(value: number): void
    {
        const buf = Buffer.allocUnsafe(2);
        buf.writeUInt16LE(value, 0);
        this.segments.push(buf);
    }

    public writeInt16LE(value: number): void
    {
        const buf = Buffer.allocUnsafe(2);
        buf.writeInt16LE(value, 0);
        this.segments.push(buf);
    }

    public writeUInt16BE(value: number): void
    {
        const buf = Buffer.allocUnsafe(2);
        buf.writeUInt16BE(value, 0);
        this.segments.push(buf);
    }

    public writeInt16BE(value: number): void
    {
        const buf = Buffer.allocUnsafe(2);
        buf.writeInt16BE(value, 0);
        this.segments.push(buf);
    }

    public writeUInt32LE(value: number): void
    {
        const buf = Buffer.allocUnsafe(4);
        buf.writeUInt32LE(value, 0);
        this.segments.push(buf);
    }

    public writeInt32LE(value: number): void
    {
        const buf = Buffer.allocUnsafe(4);
        buf.writeInt32LE(value, 0);
        this.segments.push(buf);
    }

    public writeUInt32BE(value: number): void
    {
        const buf = Buffer.allocUnsafe(4);
        buf.writeUInt32BE(value, 0);
        this.segments.push(buf);
    }

    public writeInt32BE(value: number): void
    {
        const buf = Buffer.allocUnsafe(4);
        buf.writeInt32BE(value, 0);
        this.segments.push(buf);
    }

    public writeUInt64LE(value: bigint): void
    {
        const buf = Buffer.allocUnsafe(8);
        buf.writeBigUInt64LE(value, 0);
        this.segments.push(buf);
    }

    public writeInt64LE(value: bigint): void
    {
        const buf = Buffer.allocUnsafe(8);
        buf.writeBigInt64LE(value, 0);
        this.segments.push(buf);
    }

    public writeUInt64BE(value: bigint): void
    {
        const buf = Buffer.allocUnsafe(8);
        buf.writeBigUInt64BE(value, 0);
        this.segments.push(buf);
    }

    public writeInt64BE(value: bigint): void
    {
        const buf = Buffer.allocUnsafe(8);
        buf.writeBigInt64BE(value, 0);
        this.segments.push(buf);
    }

    public writeFloatLE(value: number): void
    {
        const buf = Buffer.allocUnsafe(4);
        buf.writeFloatLE(value, 0);
        this.segments.push(buf);
    }

    public writeVector3F(vec: Vector3): void
    {
        const buf = Buffer.allocUnsafe(12);
        buf.writeFloatLE(vec.x, 0);
        buf.writeFloatLE(vec.y, 4);
        buf.writeFloatLE(vec.z, 8);
        this.segments.push(buf);
    }

    public writeFloatBE(value: number): void
    {
        const buf = Buffer.allocUnsafe(4);
        buf.writeFloatBE(value, 0);
        this.segments.push(buf);
    }

    public writeDoubleLE(value: number): void
    {
        const buf = Buffer.allocUnsafe(8);
        buf.writeDoubleLE(value, 0);
        this.segments.push(buf);
    }

    public writeDoubleBE(value: number): void
    {
        const buf = Buffer.allocUnsafe(8);
        buf.writeDoubleBE(value, 0);
        this.segments.push(buf);
    }

    public writeUUID(uuid: UUID): void
    {
        const buf = uuid.getBuffer();
        if (buf.length !== 16)
        {
            throw new Error('UUID must be 16 bytes long');
        }
        this.segments.push(buf);
    }

    public writeDate(date: Date): void
    {
        const timestamp = BigInt(date.getTime());
        this.writeUInt64LE(timestamp);
    }

    public writeCString(str: string): void
    {
        const strBuf = Buffer.from(str, 'utf-8');
        this.writeBuffer(strBuf);
        this.writeUInt8(0); // Null terminator
    }

    public writeString(str: string): void
    {
        const strBuf = Buffer.from(str, 'utf-8');
        this.writeVarInt(BigInt(strBuf.length));
        this.writeBuffer(strBuf);
    }

    public writeFixedString(str: string, len?: number): void
    {
        const buf = Buffer.from(str, 'utf-8');
        if (len !== undefined)
        {
            if (buf.length > len)
            {
                this.writeBuffer(buf.subarray(0, len));
            }
            else if (buf.length < len)
            {
                const paddedBuffer = Buffer.alloc(len, 0);
                buf.copy(paddedBuffer);
                this.writeBuffer(paddedBuffer);
            }
            else
            {
                this.writeBuffer(buf);
            }
        }
        else
        {
            this.writeBuffer(buf);
        }
    }

    public writeUUIDFromParts(
        timeLow: number,
        timeMid: number,
        timeHiAndVersion: number,
        clockSeq: number,
        node: Buffer
    ): void
    {
        if (node.length !== 6)
        {
            throw new Error('Node must be 6 bytes long');
        }
        const buf = Buffer.allocUnsafe(16);
        buf.writeUInt32LE(timeLow, 0);
        buf.writeUInt16LE(timeMid, 4);
        buf.writeUInt16LE(timeHiAndVersion, 6);
        buf.writeUInt8((clockSeq >> 8) & 0xff, 8);
        buf.writeUInt8(clockSeq & 0xff, 9);
        node.copy(buf, 10);
        this.segments.push(buf);
    }
}