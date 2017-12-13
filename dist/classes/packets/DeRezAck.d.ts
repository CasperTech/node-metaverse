/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class DeRezAckPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    TransactionData: {
        TransactionID: UUID;
        Success: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
