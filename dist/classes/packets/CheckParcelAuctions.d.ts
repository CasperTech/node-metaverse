/// <reference types="long" />
/// <reference types="node" />
import Long = require('long');
import { Packet } from '../Packet';
export declare class CheckParcelAuctionsPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    RegionData: {
        RegionHandle: Long;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
