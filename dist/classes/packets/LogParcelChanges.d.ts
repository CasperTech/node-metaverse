/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class LogParcelChangesPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    RegionData: {
        RegionHandle: Long;
    };
    ParcelData: {
        ParcelID: UUID;
        OwnerID: UUID;
        IsOwnerGroup: boolean;
        ActualArea: number;
        Action: number;
        TransactionID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
