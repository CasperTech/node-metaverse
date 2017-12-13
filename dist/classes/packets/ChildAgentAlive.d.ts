/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class ChildAgentAlivePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        RegionHandle: Long;
        ViewerCircuitCode: number;
        AgentID: UUID;
        SessionID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
