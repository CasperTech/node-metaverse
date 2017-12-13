/// <reference types="node" />
import { Packet } from '../Packet';
export declare class HealthMessagePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    HealthData: {
        Health: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
