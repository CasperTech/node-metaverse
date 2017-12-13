/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class MoneyTransferRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
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
        Description: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
