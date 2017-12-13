/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class TeleportFailedMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Info: {
        AgentID: UUID;
        Reason: Buffer;
    };
    AlertInfo: {
        Message: Buffer;
        ExtraParams: Buffer;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
