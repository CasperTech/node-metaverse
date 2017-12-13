/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class RequestParcelTransferPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        TransactionID: UUID;
        TransactionTime: number;
        SourceID: UUID;
        DestID: UUID;
        OwnerID: UUID;
        Flags: number;
        TransactionType: number;
        Amount: number;
        BillableArea: number;
        ActualArea: number;
        Final: boolean;
    };
    RegionData: {
        RegionID: UUID;
        GridX: number;
        GridY: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
