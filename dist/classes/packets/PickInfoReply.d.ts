/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class PickInfoReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    Data: {
        PickID: UUID;
        CreatorID: UUID;
        TopPick: boolean;
        ParcelID: UUID;
        Name: string;
        Desc: string;
        SnapshotID: UUID;
        User: string;
        OriginalName: string;
        SimName: string;
        PosGlobal: Vector3;
        SortOrder: number;
        Enabled: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
