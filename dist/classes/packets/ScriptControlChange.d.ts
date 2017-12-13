/// <reference types="node" />
import { Packet } from '../Packet';
export declare class ScriptControlChangePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        TakeControls: boolean;
        Controls: number;
        PassToAgent: boolean;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
