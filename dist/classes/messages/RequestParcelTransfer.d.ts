/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class RequestParcelTransferMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
