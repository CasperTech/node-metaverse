/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class MoneyTransferRequestMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    MoneyData: {
        SourceID: UUID;
        DestID: UUID;
        Flags: number;
        Amount: number;
        AggregatePermNextOwner: number;
        AggregatePermInventory: number;
        TransactionType: number;
        Description: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
