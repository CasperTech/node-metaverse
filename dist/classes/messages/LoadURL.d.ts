/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class LoadURLMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Data: {
        ObjectName: Buffer;
        ObjectID: UUID;
        OwnerID: UUID;
        OwnerIsGroup: boolean;
        Message: Buffer;
        URL: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
