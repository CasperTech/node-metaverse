/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class GroupRoleUpdateMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        GroupID: UUID;
    };
    RoleData: {
        RoleID: UUID;
        Name: Buffer;
        Description: Buffer;
        Title: Buffer;
        Powers: Long;
        UpdateType: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
