/// <reference types="node" />
/// <reference types="long" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class RegionInfoMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    RegionInfo: {
        SimName: Buffer;
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
        ProductSKU: Buffer;
        ProductName: Buffer;
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
