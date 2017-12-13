/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class ClassifiedInfoReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    Data: {
        ClassifiedID: UUID;
        CreatorID: UUID;
        CreationDate: number;
        ExpirationDate: number;
        Category: number;
        Name: string;
        Desc: string;
        ParcelID: UUID;
        ParentEstate: number;
        SnapshotID: UUID;
        SimName: string;
        PosGlobal: Vector3;
        ParcelName: string;
        ClassifiedFlags: number;
        PriceForListing: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
