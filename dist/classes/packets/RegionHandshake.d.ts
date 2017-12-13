/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class RegionHandshakePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    RegionInfo: {
        RegionFlags: number;
        SimAccess: number;
        SimName: string;
        SimOwner: UUID;
        IsEstateManager: boolean;
        WaterHeight: number;
        BillableFactor: number;
        CacheID: UUID;
        TerrainBase0: UUID;
        TerrainBase1: UUID;
        TerrainBase2: UUID;
        TerrainBase3: UUID;
        TerrainDetail0: UUID;
        TerrainDetail1: UUID;
        TerrainDetail2: UUID;
        TerrainDetail3: UUID;
        TerrainStartHeight00: number;
        TerrainStartHeight01: number;
        TerrainStartHeight10: number;
        TerrainStartHeight11: number;
        TerrainHeightRange00: number;
        TerrainHeightRange01: number;
        TerrainHeightRange10: number;
        TerrainHeightRange11: number;
    };
    RegionInfo2: {
        RegionID: UUID;
    };
    RegionInfo3: {
        CPUClassID: number;
        CPURatio: number;
        ColoName: string;
        ProductSKU: string;
        ProductName: string;
    };
    RegionInfo4: {
        RegionFlagsExtended: Long;
        RegionProtocols: Long;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
