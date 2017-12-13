/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ChatFromSimulatorMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    ChatData: {
        FromName: Buffer;
        SourceID: UUID;
        OwnerID: UUID;
        SourceType: number;
        ChatType: number;
        Audible: number;
        Position: Vector3;
        Message: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
