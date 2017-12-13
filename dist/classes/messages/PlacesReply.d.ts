/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class PlacesReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        QueryID: UUID;
    };
    TransactionData: {
        TransactionID: UUID;
    };
    QueryData: {
        OwnerID: UUID;
        Name: Buffer;
        Desc: Buffer;
        ActualArea: number;
        BillableArea: number;
        Flags: number;
        GlobalX: number;
        GlobalY: number;
        GlobalZ: number;
        SimName: Buffer;
        SnapshotID: UUID;
        Dwell: number;
        Price: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
