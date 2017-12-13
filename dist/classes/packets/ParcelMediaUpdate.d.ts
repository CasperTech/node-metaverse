/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ParcelMediaUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        MediaURL: string;
        MediaID: UUID;
        MediaAutoScale: number;
    };
    DataBlockExtended: {
        MediaType: string;
        MediaDesc: string;
        MediaWidth: number;
        MediaHeight: number;
        MediaLoop: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
