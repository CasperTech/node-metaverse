/// <reference types="node" />
import { Packet } from '../Packet';
export declare class TeleportStartPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Info: {
        TeleportFlags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
