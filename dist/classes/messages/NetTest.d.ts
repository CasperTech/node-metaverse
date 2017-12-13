/// <reference types="node" />
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class NetTestMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    NetBlock: {
        Port: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
