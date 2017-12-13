/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class RegionInfoPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    RegionInfo: {
        SimName: string;
        EstateID: number;
        ParentEstateID: number;
        RegionFlags: number;
        SimAccess: number;
        MaxAgents: number;
        BillableFactor: number;
        ObjectBonusFactor: number;
        WaterHeight: number;
        TerrainRaiseLimit: number;
        TerrainLowerLimit: number;
        PricePerMeter: number;
        RedirectGridX: number;
        RedirectGridY: number;
        UseEstateSun: boolean;
        SunHour: number;
    };
    RegionInfo2: {
        ProductSKU: string;
        ProductName: string;
        MaxAgents32: number;
        HardMaxAgents: number;
        HardMaxObjects: number;
    };
    RegionInfo3: {
        RegionFlagsExtended: Long;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
