/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class MuteListUpdateMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    MuteData: {
        AgentID: UUID;
        Filename: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
