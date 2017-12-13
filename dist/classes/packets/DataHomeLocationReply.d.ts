/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { Packet } from '../Packet';
export declare class DataHomeLocationReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Info: {
        AgentID: UUID;
        RegionHandle: Long;
        Position: Vector3;
        LookAt: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
