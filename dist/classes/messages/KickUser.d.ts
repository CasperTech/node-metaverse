/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class KickUserMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    TargetBlock: {
        TargetIP: IPAddress;
        TargetPort: number;
    };
    UserInfo: {
        AgentID: UUID;
        SessionID: UUID;
        Reason: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
