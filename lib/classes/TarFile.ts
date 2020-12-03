import * as fs from 'fs';

export class TarFile
{
    fileName: string;
    fileMode: number;
    userID: number;
    groupID: number;
    modifyTime: Date;
    linkIndicator: number;
    linkedFile: string;
    offset: number;
    fileSize: number;
    archiveFile: string;

    read(): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            fs.open(this.archiveFile, 'r', (err: Error | null, fd: number) =>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    const buf = Buffer.alloc(this.fileSize);
                    fs.read(fd, buf, 0, this.fileSize, this.offset, (err2: Error | null, _: number, buffer: Buffer) =>
                    {
                        if (err2)
                        {
                            reject(err2);
                        }
                        else
                        {
                            resolve(buffer);
                        }
                    })
                }
            });
        });
    }
}
