/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import Long = require('long');
import { Packet } from '../Packet';
export declare class TeleportFinishPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Info: {
        AgentID: UUID;
        LocationID: number;
        SimIP: IPAddress;
        SimPort: number;
        RegionHandle: Long;
        SeedCapability: string;
        SimAccess: number;
        TeleportFlags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
