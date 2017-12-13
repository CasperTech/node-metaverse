/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class PickInfoUpdatePacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    Data: {
        PickID: UUID;
        CreatorID: UUID;
        TopPick: boolean;
        ParcelID: UUID;
        Name: string;
        Desc: string;
        SnapshotID: UUID;
        PosGlobal: Vector3;
        SortOrder: number;
        Enabled: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
