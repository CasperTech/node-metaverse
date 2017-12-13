/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class EventLocationRequestMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    QueryData: {
        QueryID: UUID;
    };
    EventData: {
        EventID: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
