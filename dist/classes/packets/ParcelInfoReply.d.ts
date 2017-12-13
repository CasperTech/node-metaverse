/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ParcelInfoReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    Data: {
        ParcelID: UUID;
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
        SalePrice: number;
        AuctionID: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
