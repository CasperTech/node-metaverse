/// <reference types="long" />
/// <reference types="node" />
import Long = require('long');
import { Packet } from '../Packet';
export declare class SimStatsPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Region: {
        RegionX: number;
        RegionY: number;
        RegionFlags: number;
        ObjectCapacity: number;
    };
    Stat: {
        StatID: number;
        StatValue: number;
    }[];
    PidStat: {
        PID: number;
    };
    RegionInfo: {
        RegionFlagsExtended: Long;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
