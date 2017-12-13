/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ParcelAuctionsPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ParcelData: {
        ParcelID: UUID;
        WinnerID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
