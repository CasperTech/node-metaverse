/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class MergeParcelPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    MasterParcelData: {
        MasterID: UUID;
    };
    SlaveParcelData: {
        SlaveID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
