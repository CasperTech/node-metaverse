/// <reference types="long" />
/// <reference types="node" />
import Long = require('long');
import { Packet } from '../Packet';
export declare class NearestLandingRegionRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    RequestingRegionData: {
        RegionHandle: Long;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
