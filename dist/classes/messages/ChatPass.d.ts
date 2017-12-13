/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ChatPassMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    ChatData: {
        Channel: number;
        Position: Vector3;
        ID: UUID;
        OwnerID: UUID;
        Name: Buffer;
        SourceType: number;
        Type: number;
        Radius: number;
        SimAccess: number;
        Message: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
