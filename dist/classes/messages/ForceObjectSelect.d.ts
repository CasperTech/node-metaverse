/// <reference types="node" />
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ForceObjectSelectMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Header: {
        ResetList: boolean;
    };
    Data: {
        LocalID: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
