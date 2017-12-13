/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import Long = require('long');
import { Packet } from '../Packet';
export declare class RegionPresenceResponsePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    RegionData: {
        RegionID: UUID;
        RegionHandle: Long;
        InternalRegionIP: IPAddress;
        ExternalRegionIP: IPAddress;
        RegionPort: number;
        ValidUntil: number;
        Message: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
