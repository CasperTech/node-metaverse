/// <reference types="long" />
/// <reference types="node" />
import Long = require('long');
import { Packet } from '../Packet';
export declare class NearestLandingRegionReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    LandingRegionData: {
        RegionHandle: Long;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
