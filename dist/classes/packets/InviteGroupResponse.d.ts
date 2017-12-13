/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class InviteGroupResponsePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    InviteData: {
        AgentID: UUID;
        InviteeID: UUID;
        GroupID: UUID;
        RoleID: UUID;
        MembershipFee: number;
    };
    GroupData: {
        GroupLimit: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
