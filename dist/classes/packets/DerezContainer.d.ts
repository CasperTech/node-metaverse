/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class DerezContainerPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        ObjectID: UUID;
        Delete: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
