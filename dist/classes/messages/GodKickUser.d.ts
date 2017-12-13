/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class GodKickUserMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    UserInfo: {
        GodID: UUID;
        GodSessionID: UUID;
        AgentID: UUID;
        KickFlags: number;
        Reason: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
