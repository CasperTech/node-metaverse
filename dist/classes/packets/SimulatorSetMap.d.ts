/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class SimulatorSetMapPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    MapData: {
        RegionHandle: Long;
        Type: number;
        MapImage: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
