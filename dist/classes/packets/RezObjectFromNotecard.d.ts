/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class RezObjectFromNotecardPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        GroupID: UUID;
    };
    RezData: {
        FromTaskID: UUID;
        BypassRaycast: number;
        RayStart: Vector3;
        RayEnd: Vector3;
        RayTargetID: UUID;
        RayEndIsIntersection: boolean;
        RezSelected: boolean;
        RemoveItem: boolean;
        ItemFlags: number;
        GroupMask: number;
        EveryoneMask: number;
        NextOwnerMask: number;
    };
    NotecardData: {
        NotecardItemID: UUID;
        ObjectID: UUID;
    };
    InventoryData: {
        ItemID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
