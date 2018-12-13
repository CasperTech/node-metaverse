export class BitPack
{
    static MAX_BITS = 8;
    static ON = [1];
    static OFF = [0];

    private bitPos = 0;

    constructor(private Data: Buffer, private bytePos: number)
    {

    }

    get BytePos(): number
    {
        if (this.bytePos !== 0 && this.bitPos === 0)
        {
            return this.bytePos - 1;
        }
        else
        {
            return this.bytePos;
        }
    }

    get BitPos(): number
    {
        return this.bitPos;
    }

    UnpackFloat(): number
    {
        const output = this.UnpackBitsBuffer(32);
        return output.readFloatLE(0);
    }

    UnpackBits(count: number): number
    {
        const output = this.UnpackBitsBuffer(count);
        return output.readInt32LE(0);
    }

    UnpackUBits(count: number)
    {
        const output = this.UnpackBitsBuffer(count);
        return output.readUInt32LE(0);
    }

    UnpsckShort(): number
    {
        return this.UnpackBits(16);
    }

    UnpackUShort(): number
    {
        return this.UnpackUBits(16);
    }

    UnpackInt(): number
    {
        return this.UnpackBits(32);
    }

    UnpackUInt(): number
    {
        return this.UnpackUBits(32);
    }

    UnpackByte(): number
    {
        const output = this.UnpackBitsBuffer(8);
        return output[0];
    }

    UnpackFixed(signed: boolean, intBits: number, fracBits: number): number
    {
        let maxVal;
        let totalBits = intBits + fracBits;

        if (signed)
        {
            totalBits++;
        }
        maxVal = 1 << intBits;
        let fixedVal = 0;
        if (totalBits <= 8)
        {
            fixedVal = this.UnpackByte();
        }
        else if (totalBits <= 16)
        {
            fixedVal = this.UnpackUBits(16);
        }
        else if (totalBits <= 31)
        {
            fixedVal = this.UnpackUBits(32);
        }
        else
        {
            return 0.0;
        }

        fixedVal /= (1 << fracBits);
        if (signed)
        {
            fixedVal -= maxVal;
        }
        return fixedVal;
    }

    UnpackBitsBuffer(totalCount: number): Buffer
    {
        const newBuf = Buffer.alloc(4, 0);
        let count = 0;
        let curBytePos = 0;
        let curBitPos = 0;

        while (totalCount > 0)
        {
            if (totalCount > BitPack.MAX_BITS)
            {
                count = BitPack.MAX_BITS;
                totalCount -= BitPack.MAX_BITS;
            }
            else
            {
                count = totalCount;
                totalCount = 0;
            }
            while (count > 0)
            {
                newBuf[curBytePos] <<= 1;
                if ((this.Data[this.bytePos] & (0x80 >> this.bitPos++)) !== 0)
                {
                    ++newBuf[curBytePos];
                }
                --count;
                ++curBitPos;
                if (this.bitPos >= BitPack.MAX_BITS)
                {
                    this.bitPos = 0;
                    ++this.bytePos;
                }
                if (curBitPos >= BitPack.MAX_BITS)
                {
                    curBitPos = 0;
                    ++curBytePos;
                }
            }
        }
        return newBuf;
    }
}
