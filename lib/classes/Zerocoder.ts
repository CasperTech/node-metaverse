export class Zerocoder
{
    static Encode(buf: Buffer, start: number, end: number): Buffer
    {
        // First, run through the data and calculate how many bytes we will save
        let bytes = 0;
        let zero = 0;
        for (let i = start; i <= end; i++)
        {
            if (buf[i] === 0)
            {
                zero++;
            }
            else
            {
                if (zero > 0)
                {
                    bytes += (zero - 2);
                    zero = 0;
                }
            }
        }
        if (zero > 0)
        {
            bytes += (zero - 2);
        }

        const newBuf = Buffer.allocUnsafe(end - bytes);
        buf.copy(newBuf, 0, 0, start);

        let newBufIndex = start;
        zero = 0;
        for (let i = start; i <= end; i++)
        {
            if (buf[i] === 0)
            {
                zero++;
            }
            else
            {
                if (zero > 0)
                {
                    newBuf[newBufIndex++] = 0;
                    newBuf.writeUInt8(zero, newBufIndex++);
                    zero = 0;
                }
                newBuf[newBufIndex++] = buf[i];
            }
        }
        if (zero > 0)
        {
            newBuf[newBufIndex++] = 0;
            newBuf.writeUInt8(zero, newBufIndex);
        }
        return newBuf;
    }
    static Decode(buf: Buffer, start: number, end: number, tail: number): Buffer
    {
        // First, run through the data and calculate how many bytes have been compressed
        let bytes = 0;
        let zero = false;
        for (let i = start; i <= end; i++)
        {
            if (zero === true)
            {
                zero = false;
                // Minus two bytes for the overhead
                bytes += buf.readUInt8(i) - 2;
            }
            else if (buf[i] === 0 && i <= (end - tail))
            {
                zero = true;
            }
        }

        const newBuf = Buffer.allocUnsafe((end + 1) + bytes);
        buf.copy(newBuf, 0, 0, start - 1);
        let newBufIndex = start;
        zero = false;
        for (let i = start; i <= end; i++)
        {
            if (zero === true)
            {
                zero = false;
                const zeroCount = buf.readUInt8(i);
                for (let x = 0; x < zeroCount; x++)
                {
                    newBuf[newBufIndex++] = 0;
                }
            }
            else if (buf[i] === 0 && i <= (end - tail))
            {
                zero = true;
            }
            else
            {
                newBuf[newBufIndex++] = buf[i];
            }
        }
        return newBuf;
    }
}
