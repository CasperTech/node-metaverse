/// <reference types="node" />
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class TeleportStartMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Info: {
        TeleportFlags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
