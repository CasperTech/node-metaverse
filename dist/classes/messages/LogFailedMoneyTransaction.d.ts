/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class LogFailedMoneyTransactionMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    TransactionData: {
        TransactionID: UUID;
        TransactionTime: number;
        TransactionType: number;
        SourceID: UUID;
        DestID: UUID;
        Flags: number;
        Amount: number;
        SimulatorIP: IPAddress;
        GridX: number;
        GridY: number;
        FailureType: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
