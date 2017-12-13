/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class GroupAccountSummaryReplyPacket implements Packet {
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
        Balance: number;
        TotalCredits: number;
        TotalDebits: number;
        ObjectTaxCurrent: number;
        LightTaxCurrent: number;
        LandTaxCurrent: number;
        GroupTaxCurrent: number;
        ParcelDirFeeCurrent: number;
        ObjectTaxEstimate: number;
        LightTaxEstimate: number;
        LandTaxEstimate: number;
        GroupTaxEstimate: number;
        ParcelDirFeeEstimate: number;
        NonExemptMembers: number;
        LastTaxDate: string;
        TaxDate: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
