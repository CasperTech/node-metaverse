/// <reference types="node" />
import { Packet } from '../Packet';
export declare class ForceObjectSelectPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Header: {
        ResetList: boolean;
    };
    Data: {
        LocalID: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
