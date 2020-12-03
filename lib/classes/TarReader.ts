import { TarFile } from './TarFile';
import { TarArchive } from './TarArchive';
import { Readable } from 'stream';

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as uuid from 'uuid';

export class TarReader
{
    private outFile: string;

    constructor()
    {

    }

    parse(stream: Readable): Promise<TarArchive>
    {
        return new Promise<TarArchive>((resolve, reject) =>
        {
            let longName = false;
            let readState = 0; // 0 = waiting for header, 1 = reading file, 2 = padding, 3 = end of file
            let queuedChunks: Buffer[] = [];
            let fileChunks: Buffer[] = [];
            let queuedBytes = 0;
            let remainingBytes = 0;
            let longNameStr: string | undefined = undefined;
            let fileSize = 0;
            let paddingSize = 0;
            let pos = 0;
            const archive = new TarArchive();
            this.outFile = path.resolve(os.tmpdir() + '/' + uuid.v4() + '.tar');
            const outStream = fs.openSync(this.outFile, 'w');
            stream.on('data', (chunk: Buffer) =>
            {
                fs.writeSync(outStream, chunk);
                let goAgain = false;
                do
                {
                    goAgain = false;
                    if (readState === 1)
                    {
                        if (chunk.length > remainingBytes)
                        {
                            const wantedBytes = chunk.length - remainingBytes;
                            if (longName)
                            {
                                fileChunks.push(chunk.slice(0, chunk.length - wantedBytes));
                            }
                            queuedChunks = [chunk.slice(chunk.length - wantedBytes)];
                            queuedBytes = queuedChunks[0].length;
                            remainingBytes = 0;
                        }
                        else
                        {
                            remainingBytes -= chunk.length;
                            if (longName)
                            {
                                fileChunks.push(chunk);
                            }
                        }
                    }
                    else
                    {
                        queuedChunks.push(chunk);
                        queuedBytes += chunk.length;
                    }

                    if (readState === 0)
                    {
                        if (queuedBytes >= 512)
                        {
                            const buf = Buffer.concat(queuedChunks);
                            const header = buf.slice(0, 512);
                            queuedChunks = [buf.slice(512)];
                            queuedBytes = queuedChunks[0].length;

                            let hdrFileName = this.trimEntry(header.slice(0, 100));
                            console.log('Filename: ' + hdrFileName);
                            const hdrFileMode = this.decodeOctal(header.slice(100, 100 + 8));
                            const hdrUserID = this.decodeOctal(header.slice(108, 108 + 8));
                            const hdrGroupID = this.decodeOctal(header.slice(116, 116 + 8));
                            fileSize = this.decodeOctal(header.slice(124, 124 + 12));
                            const hdrModifyTime = this.decodeOctal(header.slice(136, 136 + 12));
                            const checksum = this.decodeOctal(header.slice(148, 148 + 8));
                            const linkIndicator = header[156];
                            const linkedFile = this.trimEntry(header.slice(157, 157 + 100));
                            paddingSize = (Math.ceil(fileSize / 512) * 512) - fileSize;

                            // Check CRC
                            let sum = 8 * 32;
                            for (let x = 0; x < 512; x++)
                            {
                                if (x < 148 || x > 155)
                                {
                                    sum += header[x];
                                }
                            }
                            if (sum !== checksum)
                            {
                                    readState = 3;
                                    continue;
                            }
                            if (linkIndicator === 76)
                            {
                                longName = true;
                            }
                            else
                            {
                                if (longNameStr !== undefined)
                                {
                                    hdrFileName = longNameStr;
                                    longNameStr = undefined;
                                    longName = false;
                                }
                                const file = new TarFile();
                                file.archiveFile = this.outFile;
                                file.fileName = hdrFileName;
                                file.fileMode = hdrFileMode;
                                file.userID = hdrUserID;
                                file.groupID = hdrGroupID;
                                file.modifyTime = new Date(hdrModifyTime * 1000);
                                file.linkIndicator = linkIndicator;
                                file.linkedFile = linkedFile;
                                file.offset = pos + 512;
                                file.fileSize = fileSize;
                                archive.files.push(file);
                            }
                            remainingBytes = fileSize;
                            readState = 1;
                            goAgain = true;
                            chunk = queuedChunks[0];
                            queuedBytes = 0;
                            queuedChunks = [];
                            pos += 512;
                            continue;
                        }
                    }
                    if (readState === 1 && remainingBytes === 0)
                    {
                        if (longName)
                        {
                            longNameStr = Buffer.concat(fileChunks).toString('ascii');
                            fileChunks = [];
                        }
                        pos += fileSize;
                        readState = 2;
                    }
                    if (readState === 2 && queuedBytes >= paddingSize)
                    {
                        const buf = Buffer.concat(queuedChunks);
                        queuedChunks = [buf.slice(paddingSize)];
                        queuedBytes = queuedChunks[0].length;
                        readState = 0;
                        chunk = Buffer.alloc(0);
                        goAgain = true;
                        pos += paddingSize;
                    }
                }
                while (goAgain);
            }).on('end', () =>
            {
                if ((readState !== 0 && readState !== 3) || queuedBytes > 0)
                {
                    console.warn('Warning: Garbage at end of file');
                }
                fs.closeSync(outStream);
                resolve(archive);
            }).on('error', (err) =>
            {
                reject(err);
            });
        });
    }

    close(): void
    {
        fs.unlinkSync(this.outFile);
        this.outFile = '';
    }

    private trimEntry(buf: Buffer): string
    {
        let end = buf.indexOf('\0');
        if (end === -1)
        {
            end = buf.length - 1;
        }
        return buf.slice(0, end).toString('ascii');
    }

    private decodeOctal(buf: Buffer): number
    {
        const str = this.trimEntry(buf);
        return parseInt(str, 8);
    }
}
