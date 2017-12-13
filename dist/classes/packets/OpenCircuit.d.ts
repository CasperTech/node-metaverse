/// <reference types="node" />
import { IPAddress } from '../IPAddress';
import { Packet } from '../Packet';
export declare class OpenCircuitPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    CircuitInfo: {
        IP: IPAddress;
        Port: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
