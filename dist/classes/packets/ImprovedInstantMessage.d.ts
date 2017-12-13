/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class ImprovedInstantMessagePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    MessageBlock: {
        FromGroup: boolean;
        ToAgentID: UUID;
        ParentEstateID: number;
        RegionID: UUID;
        Position: Vector3;
        Offline: number;
        Dialog: number;
        ID: UUID;
        Timestamp: number;
        FromAgentName: string;
        Message: string;
        BinaryBucket: string;
    };
    EstateBlock: {
        EstateID: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
