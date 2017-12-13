/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ParcelAccessListUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    Data: {
        Flags: number;
        LocalID: number;
        TransactionID: UUID;
        SequenceID: number;
        Sections: number;
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
