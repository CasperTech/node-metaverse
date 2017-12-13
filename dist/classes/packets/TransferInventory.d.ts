/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class TransferInventoryPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    InfoBlock: {
        SourceID: UUID;
        DestID: UUID;
        TransactionID: UUID;
    };
    InventoryBlock: {
        InventoryID: UUID;
        Type: number;
    }[];
    ValidationBlock: {
        NeedsValidation: boolean;
        EstateID: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
