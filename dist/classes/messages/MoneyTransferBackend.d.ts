/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class MoneyTransferBackendMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
        Description: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
