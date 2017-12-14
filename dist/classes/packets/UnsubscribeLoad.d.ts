/// <reference types="node" />
import { Packet } from '../Packet';
export declare class UnsubscribeLoadPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}