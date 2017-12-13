/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class DirLandQueryBackendPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    QueryData: {
        QueryID: UUID;
        QueryFlags: number;
        SearchType: number;
        Price: number;
        Area: number;
        QueryStart: number;
        EstateID: number;
        Godlike: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
