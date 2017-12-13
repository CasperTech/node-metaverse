/// <reference types="node" />
/// <reference types="long" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class GroupRoleDataReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
    };
    GroupData: {
        GroupID: UUID;
        RequestID: UUID;
        RoleCount: number;
    };
    RoleData: {
        RoleID: UUID;
        Name: Buffer;
        Title: Buffer;
        Description: Buffer;
        Powers: Long;
        Members: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
