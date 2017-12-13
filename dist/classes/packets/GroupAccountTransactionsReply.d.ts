/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class GroupAccountTransactionsReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        GroupID: UUID;
    };
    MoneyData: {
        RequestID: UUID;
        IntervalDays: number;
        CurrentInterval: number;
        StartDate: string;
    };
    HistoryData: {
        Time: string;
        User: string;
        Type: number;
        Item: string;
        Amount: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
