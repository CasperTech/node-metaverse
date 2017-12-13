/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class MeanCollisionAlertPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    MeanCollision: {
        Victim: UUID;
        Perp: UUID;
        Time: number;
        Mag: number;
        Type: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
