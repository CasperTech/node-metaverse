/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class SetSimPresenceInDatabasePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    SimData: {
        RegionID: UUID;
        HostName: string;
        GridX: number;
        GridY: number;
        PID: number;
        AgentCount: number;
        TimeToLive: number;
        Status: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
