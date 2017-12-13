/// <reference types="node" />
import { Packet } from '../Packet';
export declare class EdgeDataPacketPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    EdgeData: {
        LayerType: number;
        Direction: number;
        LayerData: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
