/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class PlacesReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        QueryID: UUID;
    };
    TransactionData: {
        TransactionID: UUID;
    };
    QueryData: {
        OwnerID: UUID;
        Name: string;
        Desc: string;
        ActualArea: number;
        BillableArea: number;
        Flags: number;
        GlobalX: number;
        GlobalY: number;
        GlobalZ: number;
        SimName: string;
        SnapshotID: UUID;
        Dwell: number;
        Price: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
