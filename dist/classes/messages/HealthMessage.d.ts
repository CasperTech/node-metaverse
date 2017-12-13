/// <reference types="node" />
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class HealthMessageMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    HealthData: {
        Health: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
