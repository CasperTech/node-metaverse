/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { Packet } from '../Packet';
export declare class CrossedRegionPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    RegionData: {
        SimIP: IPAddress;
        SimPort: number;
        RegionHandle: Long;
        SeedCapability: string;
    };
    Info: {
        Position: Vector3;
        LookAt: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
