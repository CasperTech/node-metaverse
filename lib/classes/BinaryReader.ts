import { UUID } from "./UUID";

export class BinaryReader
{
    public pos = 0;

    public constructor(private readonly buf: Buffer)
    {

    }

    public seek(pos: number): void
    {
        if (pos < 0 || pos > this.buf.length)
        {
            throw new RangeError(`Invalid seek position: ${pos}`);
        }
        this.pos = pos;
    }

    public getPos(): number
    {
        return this.pos;
    }

    public peekUInt8(): number
    {
        this.checkBounds(1);
        return this.buf.readUInt8(this.pos);
    }

    public peekInt8(): number
    {
        this.checkBounds(1);
        return this.buf.readInt8(this.pos);
    }

    public peekUInt16LE(): number
    {
        this.checkBounds(2);
        return this.buf.readUInt16LE(this.pos);
    }

    public peekInt16LE(): number
    {
        this.checkBounds(2);
        return this.buf.readInt16LE(this.pos);
    }

    public peekUInt16BE(): number
    {
        this.checkBounds(2);
        return this.buf.readUInt16BE(this.pos);
    }

    public peekInt16BE(): number
    {
        this.checkBounds(2);
        return this.buf.readInt16BE(this.pos);
    }

    public peekUInt32LE(): number
    {
        this.checkBounds(4);
        return this.buf.readUInt32LE(this.pos);
    }

    public peekInt32LE(): number
    {
        this.checkBounds(4);
        return this.buf.readInt32LE(this.pos);
    }

    public peekUInt32BE(): number
    {
        this.checkBounds(4);
        return this.buf.readUInt32BE(this.pos);
    }

    public peekInt32BE(): number
    {
        this.checkBounds(4);
        return this.buf.readInt32BE(this.pos);
    }

    public peekUInt64LE(): bigint
    {
        this.checkBounds(8);
        return this.buf.readBigUInt64LE(this.pos);
    }

    public peekInt64LE(): bigint
    {
        this.checkBounds(8);
        return this.buf.readBigInt64LE(this.pos);
    }

    public peekUInt64BE(): bigint
    {
        this.checkBounds(8);
        return this.buf.readBigUInt64BE(this.pos);
    }

    public peekInt64BE(): bigint
    {
        this.checkBounds(8);
        return this.buf.readBigInt64BE(this.pos);
    }

    public peekFloatLE(): number
    {
        this.checkBounds(4);
        return this.buf.readFloatLE(this.pos);
    }

    public peekFloatBE(): number
    {
        this.checkBounds(4);
        return this.buf.readFloatBE(this.pos);
    }

    public peekDoubleLE(): number
    {
        this.checkBounds(8);
        return this.buf.readDoubleLE(this.pos);
    }

    public peekDoubleBE(): number
    {
        this.checkBounds(8);
        return this.buf.readDoubleBE(this.pos);
    }

    public peekUUID(): UUID
    {
        this.checkBounds(16);
        return new UUID(this.buf, this.pos);
    }

    public peekDate(): Date
    {
        this.checkBounds(8);
        return new Date(Number(this.peekUInt64LE()));
    }

    public peekBuffer(length: number): Buffer
    {
        if (this.pos + length > this.buf.length)
        {
            throw new RangeError("Attempt to read beyond buffer length");
        }
        return this.buf.subarray(this.pos, this.pos + length);
    }

    public peekVarInt(): { value: number | bigint; bytesRead: number }
    {
        let value = 0n;
        let bytesRead = 0;
        let shift = 0n;

        while (this.pos + bytesRead < this.buf.length)
        {
            const byte = this.buf[this.pos + bytesRead];
            bytesRead++;

            const byteValue = BigInt(byte & 0x7F);
            value |= (byteValue << shift);

            if ((byte & 0x80) === 0)
            {
                break;
            }

            shift += 7n;

            if (bytesRead > 100)
            {
                throw new Error('VarInt is too long');
            }
        }

        if (bytesRead === 0 || (this.pos + bytesRead) > this.buf.length)
        {
            throw new Error('Incomplete VarInt');
        }

        const decoded = (value >> 1n) ^ -(value & 1n);

        if (
            decoded >= BigInt(Number.MIN_SAFE_INTEGER) &&
            decoded <= BigInt(Number.MAX_SAFE_INTEGER)
        )
        {
            return {value: Number(decoded), bytesRead};
        }
        else
        {
            return {value: decoded, bytesRead};
        }
    }

    public peekString(metadata?: { length: number | bigint, bytesRead: number }): string
    {
        const {value: length, bytesRead} = this.peekVarInt();
        if (length < 0)
        {
            throw new Error('Error reading string: Length is negative');
        }
        this.checkBounds(bytesRead + Number(length));
        const start = this.pos + bytesRead;
        const end = start + Number(length);
        const stringData = this.buf.subarray(start, end);
        if (metadata)
        {
            metadata.length = length;
            metadata.bytesRead = bytesRead;
        }
        return new TextDecoder("utf-8").decode(stringData);
    }

    public peekCString(): string
    {
        let tempPos = this.pos;
        const start = tempPos;

        while (tempPos < this.buf.length && this.buf[tempPos] !== 0)
        {
            tempPos++;
        }

        if (tempPos >= this.buf.length)
        {
            throw new RangeError("Null-terminated string not found");
        }

        const stringData = this.buf.subarray(start, tempPos);
        return new TextDecoder("utf-8").decode(stringData);
    }

    public peekFixedString(length: number): string
    {
        this.checkBounds(length);
        return this.buf.subarray(this.pos, this.pos + length).toString('utf-8');
    }

    // read

    public readUInt8(): number
    {
        const num = this.peekUInt8();
        this.pos++;
        return num;
    }

    public readInt8(): number
    {
        const num = this.peekInt8();
        this.pos++;
        return num;
    }

    public readUInt16LE(): number
    {
        const num = this.peekUInt16LE();
        this.pos += 2;
        return num;
    }

    public readInt16LE(): number
    {
        const num = this.peekInt16LE();
        this.pos += 2;
        return num;
    }

    public readUInt16BE(): number
    {
        const num = this.peekUInt16BE();
        this.pos += 2;
        return num;
    }

    public readInt16BE(): number
    {
        const num = this.peekInt16BE();
        this.pos += 2;
        return num;
    }

    public readUInt32LE(): number
    {
        const num = this.peekUInt32LE();
        this.pos += 4;
        return num;
    }

    public readInt32LE(): number
    {
        const num = this.peekInt32LE();
        this.pos += 4;
        return num;
    }

    public readUInt32BE(): number
    {
        const num = this.peekUInt32BE();
        this.pos += 4;
        return num;
    }

    public readInt32BE(): number
    {
        const num = this.peekInt32BE();
        this.pos += 4;
        return num;
    }


    public readUInt64LE(): bigint
    {
        const num = this.peekUInt64LE();
        this.pos += 8;
        return num;
    }

    public readInt64LE(): bigint
    {
        const num = this.peekInt64LE();
        this.pos += 8;
        return num;
    }

    public readUInt64BE(): bigint
    {
        const num = this.peekUInt64BE();
        this.pos += 8;
        return num;
    }

    public readInt64BE(): bigint
    {
        const num = this.peekInt64BE();
        this.pos += 8;
        return num;
    }

    public readFloatLE(): number
    {
        const num = this.peekFloatLE();
        this.pos += 4;
        return num;
    }

    public readFloatBE(): number
    {
        const num = this.peekFloatBE();
        this.pos += 4;
        return num;
    }

    public readDoubleLE(): number
    {
        const num = this.peekDoubleLE();
        this.pos += 8;
        return num;
    }

    public readDoubleBE(): number
    {
        const num = this.peekDoubleBE();
        this.pos += 8;
        return num;
    }

    public readUUID(): UUID
    {
        const uuid = this.peekUUID();
        this.pos += 16;
        return uuid;
    }

    public readDate(): Date
    {
        const d = this.peekDate();
        this.pos += 8;
        return d;
    }

    public readBuffer(length: number): Buffer
    {
        const buffer = this.peekBuffer(length);
        this.pos += length;
        return buffer;
    }

    public readCString(): string
    {
        const str = this.peekCString();
        this.pos += Buffer.byteLength(str, "utf-8") + 1; // Include null terminator
        return str;
    }

    public readString(): string
    {
        const md: {
            length: number | bigint,
            bytesRead: number
        } = {
            length: 0,
            bytesRead: 0
        }
        const str = this.peekString(md);
        this.pos += md.bytesRead + Number(md.length);
        return str;
    }

    public readFixedString(length: number): string
    {
        const str = this.peekFixedString(length);
        this.pos += length;
        return str;
    }

    public length(): number
    {
        return this.buf.length;
    }

    public readVarInt(): number | bigint
    {
        const {value, bytesRead} = this.peekVarInt();
        this.pos += bytesRead;
        return value;
    }

    private checkBounds(length: number): void
    {
        if (this.pos + length > this.buf.length)
        {
            throw new RangeError(`Attempt to read beyond buffer length: position=${this.pos}, length=${length}, bufferSize=${this.buf.length}`);
        }
    }
}