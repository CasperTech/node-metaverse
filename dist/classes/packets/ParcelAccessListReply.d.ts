/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ParcelAccessListReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        AgentID: UUID;
        SequenceID: number;
        Flags: number;
        LocalID: number;
    };
    List: {
        ID: UUID;
        Time: number;
        Flags: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
