/// <reference types="node" />
import { MessageFlags } from '../enums/MessageFlags';
import { Message } from '../enums/Message';
export interface MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
