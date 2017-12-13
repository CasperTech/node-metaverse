/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class PlacesQueryPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        QueryID: UUID;
    };
    TransactionData: {
        TransactionID: UUID;
    };
    QueryData: {
        QueryText: string;
        QueryFlags: number;
        Category: number;
        SimName: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
