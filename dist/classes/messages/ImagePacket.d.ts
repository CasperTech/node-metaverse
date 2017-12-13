/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ImagePacketMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    ImageID: {
        ID: UUID;
        Packet: number;
    };
    ImageData: {
        Data: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
