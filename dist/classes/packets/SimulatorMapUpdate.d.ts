/// <reference types="node" />
import { Packet } from '../Packet';
export declare class SimulatorMapUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    MapData: {
        Flags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
