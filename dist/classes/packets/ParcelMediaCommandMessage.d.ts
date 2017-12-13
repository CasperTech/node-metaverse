/// <reference types="node" />
import { Packet } from '../Packet';
export declare class ParcelMediaCommandMessagePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    CommandBlock: {
        Flags: number;
        Command: number;
        Time: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
