/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class GroupMembersReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
    };
    GroupData: {
        GroupID: UUID;
        RequestID: UUID;
        MemberCount: number;
    };
    MemberData: {
        AgentID: UUID;
        Contribution: number;
        OnlineStatus: Buffer;
        AgentPowers: Long;
        Title: Buffer;
        IsOwner: boolean;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
