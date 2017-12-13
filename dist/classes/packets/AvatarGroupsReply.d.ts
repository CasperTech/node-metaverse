/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { Packet } from '../Packet';
export declare class AvatarGroupsReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        AvatarID: UUID;
    };
    GroupData: {
        GroupPowers: Long;
        AcceptNotices: boolean;
        GroupTitle: string;
        GroupID: UUID;
        GroupName: string;
        GroupInsigniaID: UUID;
    }[];
    NewGroupData: {
        ListInProfile: boolean;
    };
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
