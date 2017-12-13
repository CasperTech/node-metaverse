/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class RequestXferPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    XferID: {
        ID: Long;
        Filename: string;
        FilePath: number;
        DeleteOnCompletion: boolean;
        UseBigPackets: boolean;
        VFileID: UUID;
        VFileType: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
