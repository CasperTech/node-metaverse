/// <reference types="node" />
import { Packet } from '../Packet';
export declare class LayerDataPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    LayerID: {
        Type: number;
    };
    LayerData: {
        Data: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
