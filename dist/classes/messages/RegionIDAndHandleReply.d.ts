/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class RegionIDAndHandleReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    ReplyBlock: {
        RegionID: UUID;
        RegionHandle: Long;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
