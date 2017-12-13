/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class MoneyBalanceReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    MoneyData: {
        AgentID: UUID;
        TransactionID: UUID;
        TransactionSuccess: boolean;
        MoneyBalance: number;
        SquareMetersCredit: number;
        SquareMetersCommitted: number;
        Description: string;
    };
    TransactionInfo: {
        TransactionType: number;
        SourceID: UUID;
        IsSourceGroup: boolean;
        DestID: UUID;
        IsDestGroup: boolean;
        Amount: number;
        ItemDescription: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
