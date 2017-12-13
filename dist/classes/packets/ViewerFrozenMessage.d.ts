/// <reference types="node" />
import { Packet } from '../Packet';
export declare class ViewerFrozenMessagePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    FrozenData: {
        Data: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
