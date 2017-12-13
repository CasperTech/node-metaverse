/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class DirFindQueryPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    QueryData: {
        QueryID: UUID;
        QueryText: string;
        QueryFlags: number;
        QueryStart: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
