import * as fs from 'fs';
import { Readable, Transform } from 'stream';

export class TarWriter extends Transform
{
    private thisFileSize = 0;

    private fileActive = false;

    async newFile(archivePath: string, realPath: string): Promise<void>
    {
        if (this.fileActive)
        {
            this.endFile();
        }
        const stat = fs.statSync(realPath);

        const buf = Buffer.from(archivePath, 'ascii');
        this.writeHeader(
            this.chopString('././@LongName', 100),
            stat.mode,
            stat.uid,
            stat.gid,
            buf.length,
            stat.mtime,
            'L'
        );
        this.thisFileSize = buf.length;
        await this.pipeFromBuffer(buf);
        this.endFile();

        this.writeHeader(
            this.chopString(archivePath, 100),
            stat.mode,
            stat.uid,
            stat.gid,
            stat.size,
            stat.mtime,
            '0'
        );

        this.thisFileSize = stat.size;
        this.fileActive = true;
    }

    async pipeFromBuffer(buf: Buffer): Promise<void>
    {
        const readableInstanceStream = new Readable({
            read(): void
            {
                this.push(buf);
                this.push(null);
            }
        });
        return this.pipeFrom(readableInstanceStream);
    }

    pipeFrom(str: Readable): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            str.on('error', (err) =>
            {
               reject(err);
            });
            str.on('end', () =>
            {
                resolve();
            });
            str.pipe(this, { end: false });
        });
    }

    private async writeHeader(fileName: string, mode: number, uid: number, gid: number, fileSize: number, mTime: Date, fileType: string): Promise<void>
    {
        const header = Buffer.alloc(512);

        const name = this.chopString(fileName, 100);
        header.write(name, 0, (name.length <= 100 ? name.length : 100));

        this.octalBuf(mode, 8).copy(header, 100);
        this.octalBuf(uid, 8).copy(header, 108);
        this.octalBuf(gid, 8).copy(header, 116);
        this.octalBuf(fileSize, 12).copy(header, 124);
        this.octalBuf(Math.floor(mTime.getTime() / 1000), 12).copy(header, 136);

        header.write(fileType, 156, 1);

        let sum = 8 * 32;
        for (let x = 0; x < 512; x++)
        {
            if (x < 148 || x > 155)
            {
                sum += header.readUInt8(x);
            }
        }
        let sumStr = this.octalString(sum, 6);
        while (sumStr.length < 6)
        {
            sumStr = '0' + sumStr;
        }
        sumStr += '\0 ';
        header.write(sumStr, 148, sumStr.length);
        return this.pipeFromBuffer(header);
    }

    async endFile(): Promise<void>
    {
        const finalSize = Math.ceil(this.thisFileSize / 512) * 512;
        const remainingSize = finalSize - this.thisFileSize;
        const buf = Buffer.alloc(remainingSize);
        await this.pipeFromBuffer(buf);
        this.fileActive = false;
    }

    public _transform(chunk: any, encoding: 'ascii' | 'utf-8' | 'utf16le' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex', callback: (error?: Error, data?: any) => void): void
    {
        this.push(chunk, encoding);
        callback();
    }

    private chopString(str: string, maxLength: number): string
    {
        return str.substring(0, maxLength - 1);
    }

    private octalBuf(num: number, length: number): Buffer
    {
        const buf = Buffer.alloc(length - 1, '0');
        const result = this.chopString(Math.floor(num).toString(8), length);
        buf.write(result, length - (result.length + 1), result.length);
        return buf;
    }

    private octalString(num: number, length: number): string
    {
        return this.octalBuf(num, length).toString('ascii');
    }
}
