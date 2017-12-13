/// <reference types="node" />
import { Packet } from '../Packet';
export declare class TestMessagePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    TestBlock1: {
        Test1: number;
    };
    NeighborBlock: {
        Test0: number;
        Test1: number;
        Test2: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
