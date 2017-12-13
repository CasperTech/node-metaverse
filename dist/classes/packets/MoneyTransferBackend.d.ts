/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class MoneyTransferBackendPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    MoneyData: {
        TransactionID: UUID;
        TransactionTime: number;
        SourceID: UUID;
        DestID: UUID;
        Flags: number;
        Amount: number;
        AggregatePermNextOwner: number;
        AggregatePermInventory: number;
        TransactionType: number;
        RegionID: UUID;
        GridX: number;
        GridY: number;
        Description: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
