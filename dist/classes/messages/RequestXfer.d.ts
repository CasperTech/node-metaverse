/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class RequestXferMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    XferID: {
        ID: Long;
        Filename: Buffer;
        FilePath: number;
        DeleteOnCompletion: boolean;
        UseBigPackets: boolean;
        VFileID: UUID;
        VFileType: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
