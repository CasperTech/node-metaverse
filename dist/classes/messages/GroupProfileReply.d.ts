/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class GroupProfileReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
    };
    GroupData: {
        GroupID: UUID;
        Name: Buffer;
        Charter: Buffer;
        ShowInList: boolean;
        MemberTitle: Buffer;
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
