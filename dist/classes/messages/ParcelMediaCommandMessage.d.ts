/// <reference types="node" />
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ParcelMediaCommandMessageMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    CommandBlock: {
        Flags: number;
        Command: number;
        Time: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
