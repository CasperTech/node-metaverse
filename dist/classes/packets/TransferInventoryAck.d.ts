/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class TransferInventoryAckPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    InfoBlock: {
        TransactionID: UUID;
        InventoryID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
