/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class GroupProfileReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    GroupData: {
        GroupID: UUID;
        Name: string;
        Charter: string;
        ShowInList: boolean;
        MemberTitle: string;
        PowersMask: Long;
        InsigniaID: UUID;
        FounderID: UUID;
        MembershipFee: number;
        OpenEnrollment: boolean;
        Money: number;
        GroupMembershipCount: number;
        GroupRolesCount: number;
        AllowPublish: boolean;
        MaturePublish: boolean;
        OwnerRole: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
