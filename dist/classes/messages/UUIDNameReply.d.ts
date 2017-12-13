/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class UUIDNameReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    UUIDNameBlock: {
        ID: UUID;
        FirstName: Buffer;
        LastName: Buffer;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
