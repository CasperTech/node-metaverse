/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class DirPlacesQueryBackendPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    QueryData: {
        QueryID: UUID;
        QueryText: string;
        QueryFlags: number;
        Category: number;
        SimName: string;
        EstateID: number;
        Godlike: boolean;
        QueryStart: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
