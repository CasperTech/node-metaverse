/// <reference types="long" />
/// <reference types="node" />
import Long = require('long');
import { Packet } from '../Packet';
export declare class ObjectUpdateCompressedPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    RegionData: {
        RegionHandle: Long;
        TimeDilation: number;
    };
    ObjectData: {
        UpdateFlags: number;
        Data: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
