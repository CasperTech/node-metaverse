/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class ObjectDuplicateOnRayPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        GroupID: UUID;
        RayStart: Vector3;
        RayEnd: Vector3;
        BypassRaycast: boolean;
        RayEndIsIntersection: boolean;
        CopyCenters: boolean;
        CopyRotates: boolean;
        RayTargetID: UUID;
        DuplicateFlags: number;
    };
    ObjectData: {
        ObjectLocalID: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
