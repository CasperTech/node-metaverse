/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class GroupAccountSummaryReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        GroupID: UUID;
    };
    MoneyData: {
        RequestID: UUID;
        IntervalDays: number;
        CurrentInterval: number;
        StartDate: Buffer;
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
        LastTaxDate: Buffer;
        TaxDate: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
