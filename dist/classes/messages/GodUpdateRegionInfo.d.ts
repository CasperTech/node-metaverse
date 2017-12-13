/// <reference types="node" />
/// <reference types="long" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class GodUpdateRegionInfoMessage implements MessageBase {
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
