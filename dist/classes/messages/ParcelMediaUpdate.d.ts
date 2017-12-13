/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ParcelMediaUpdateMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    DataBlock: {
        MediaURL: Buffer;
        MediaID: UUID;
        MediaAutoScale: number;
    };
    DataBlockExtended: {
        MediaType: Buffer;
        MediaDesc: Buffer;
        MediaWidth: number;
        MediaHeight: number;
        MediaLoop: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
