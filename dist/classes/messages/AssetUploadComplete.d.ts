/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class AssetUploadCompleteMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    AssetBlock: {
        UUID: UUID;
        Type: number;
        Success: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
