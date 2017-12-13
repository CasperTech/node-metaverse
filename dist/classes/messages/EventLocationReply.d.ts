/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class EventLocationReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    QueryData: {
        QueryID: UUID;
    };
    EventData: {
        Success: boolean;
        RegionID: UUID;
        RegionPos: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
