/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class CoarseLocationUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Location: {
        X: number;
        Y: number;
        Z: number;
    }[];
    Index: {
        You: number;
        Prey: number;
    };
    AgentData: {
        AgentID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
