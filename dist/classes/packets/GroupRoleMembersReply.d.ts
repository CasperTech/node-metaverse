/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class GroupRoleMembersReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        GroupID: UUID;
        RequestID: UUID;
        TotalPairs: number;
    };
    MemberData: {
        RoleID: UUID;
        MemberID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
