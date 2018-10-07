/// <reference types="node" />
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ScriptDataRequestMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    DataBlock: {
        Hash: Long;
        RequestType: number;
        Request: Buffer;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
