/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class DeRezObjectPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    AgentBlock: {
        GroupID: UUID;
        Destination: number;
        DestinationID: UUID;
        TransactionID: UUID;
        PacketCount: number;
        PacketNumber: number;
    };
    ObjectData: {
        ObjectLocalID: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
