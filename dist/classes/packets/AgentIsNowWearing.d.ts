/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class AgentIsNowWearingPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    WearableData: {
        ItemID: UUID;
        WearableType: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
