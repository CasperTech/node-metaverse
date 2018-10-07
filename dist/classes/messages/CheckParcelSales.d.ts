/// <reference types="node" />
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class CheckParcelSalesMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    RegionData: {
        RegionHandle: Long;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
