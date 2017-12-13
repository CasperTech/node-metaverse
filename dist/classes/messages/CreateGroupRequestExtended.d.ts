/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class CreateGroupRequestExtendedMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        GroupLimit: number;
    };
    GroupData: {
        Name: Buffer;
        Charter: Buffer;
        ShowInList: boolean;
        InsigniaID: UUID;
        MembershipFee: number;
        OpenEnrollment: boolean;
        AllowPublish: boolean;
        MaturePublish: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
