/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class RebakeAvatarTexturesMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    TextureData: {
        TextureID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
