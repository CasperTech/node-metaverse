/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class LeaveGroupReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    GroupData: {
        GroupID: UUID;
        Success: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
