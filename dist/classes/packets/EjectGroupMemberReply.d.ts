/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class EjectGroupMemberReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    GroupData: {
        GroupID: UUID;
    };
    EjectData: {
        Success: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
