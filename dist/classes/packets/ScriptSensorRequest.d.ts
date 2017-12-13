/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { Quaternion } from '../Quaternion';
import { Packet } from '../Packet';
export declare class ScriptSensorRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Requester: {
        SourceID: UUID;
        RequestID: UUID;
        SearchID: UUID;
        SearchPos: Vector3;
        SearchDir: Quaternion;
        SearchName: string;
        Type: number;
        Range: number;
        Arc: number;
        RegionHandle: Long;
        SearchRegions: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
