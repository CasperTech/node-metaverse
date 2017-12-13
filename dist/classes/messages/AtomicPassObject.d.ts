/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class AtomicPassObjectMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    TaskData: {
        TaskID: UUID;
        AttachmentNeedsSave: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
