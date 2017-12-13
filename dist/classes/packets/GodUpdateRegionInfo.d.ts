/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class GodUpdateRegionInfoPacket implements Packet {
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
        BillableFactor: number;
        PricePerMeter: number;
        RedirectGridX: number;
        RedirectGridY: number;
    };
    RegionInfo2: {
        RegionFlagsExtended: Long;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
