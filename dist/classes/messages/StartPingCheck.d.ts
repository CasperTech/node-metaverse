/// <reference types="node" />
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class StartPingCheckMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    PingID: {
        PingID: number;
        OldestUnacked: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
