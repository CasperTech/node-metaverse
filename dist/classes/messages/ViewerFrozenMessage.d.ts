/// <reference types="node" />
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ViewerFrozenMessageMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    FrozenData: {
        Data: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
