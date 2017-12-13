/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { Packet } from '../Packet';
export declare class SetStartLocationPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    StartLocationData: {
        AgentID: UUID;
        RegionID: UUID;
        LocationID: number;
        RegionHandle: Long;
        LocationPos: Vector3;
        LocationLookAt: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
