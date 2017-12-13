/// <reference types="node" />
import { Packet } from '../Packet';
export declare class ParcelOverlayPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ParcelData: {
        SequenceID: number;
        Data: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
