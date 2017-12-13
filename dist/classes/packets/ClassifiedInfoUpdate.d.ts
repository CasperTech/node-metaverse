/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class ClassifiedInfoUpdatePacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    Data: {
        ClassifiedID: UUID;
        Category: number;
        Name: string;
        Desc: string;
        ParcelID: UUID;
        ParentEstate: number;
        SnapshotID: UUID;
        PosGlobal: Vector3;
        ClassifiedFlags: number;
        PriceForListing: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
