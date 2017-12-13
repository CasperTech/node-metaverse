/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class RequestMultipleObjectsPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ObjectData: {
        CacheMissType: number;
        ID: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
