/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { Packet } from '../Packet';
export declare class LogFailedMoneyTransactionPacket implements Packet {
    name: string;
    flags: number;
    id: number;
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
