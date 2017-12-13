/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class AddCircuitCodePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    CircuitCode: {
        Code: number;
        SessionID: UUID;
        AgentID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
