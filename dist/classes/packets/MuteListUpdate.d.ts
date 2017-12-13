/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class MuteListUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    MuteData: {
        AgentID: UUID;
        Filename: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
