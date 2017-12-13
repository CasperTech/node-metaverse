/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class RoutedMoneyBalanceReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    TargetBlock: {
        TargetIP: IPAddress;
        TargetPort: number;
    };
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
