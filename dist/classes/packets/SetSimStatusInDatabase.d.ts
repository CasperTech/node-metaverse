/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class SetSimStatusInDatabasePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        RegionID: UUID;
        HostName: string;
        X: number;
        Y: number;
        PID: number;
        AgentCount: number;
        TimeToLive: number;
        Status: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
