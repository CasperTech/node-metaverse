/// <reference types="long" />
/// <reference types="node" />
import { Vector3 } from '../Vector3';
import Long = require('long');
import { Packet } from '../Packet';
export declare class SimulatorViewerTimeMessagePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    TimeInfo: {
        UsecSinceStart: Long;
        SecPerDay: number;
        SecPerYear: number;
        SunDirection: Vector3;
        SunPhase: number;
        SunAngVelocity: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
