/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class TeleportLocalPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Info: {
        AgentID: UUID;
        LocationID: number;
        Position: Vector3;
        LookAt: Vector3;
        TeleportFlags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
