/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class LiveHelpGroupRequestMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    RequestData: {
        RequestID: UUID;
        AgentID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
