/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ParcelBuyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    Data: {
        GroupID: UUID;
        IsGroupOwned: boolean;
        RemoveContribution: boolean;
        LocalID: number;
        Final: boolean;
    };
    ParcelData: {
        Price: number;
        Area: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
