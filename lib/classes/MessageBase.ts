import { Message } from '../enums/Message';
import { MessageFlags } from '../enums/MessageFlags';

export interface MessageBase
{
    name: string;
    messageFlags: MessageFlags;
    id: Message;

    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
