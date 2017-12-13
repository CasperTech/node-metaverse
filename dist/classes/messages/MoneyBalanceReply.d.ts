/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class MoneyBalanceReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    MoneyData: {
        AgentID: UUID;
        TransactionID: UUID;
        TransactionSuccess: boolean;
        MoneyBalance: number;
        SquareMetersCredit: number;
        SquareMetersCommitted: number;
        Description: Buffer;
    };
    TransactionInfo: {
        TransactionType: number;
        SourceID: UUID;
        IsSourceGroup: boolean;
        DestID: UUID;
        IsDestGroup: boolean;
        Amount: number;
        ItemDescription: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
