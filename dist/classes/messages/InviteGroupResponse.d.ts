/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class InviteGroupResponseMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
