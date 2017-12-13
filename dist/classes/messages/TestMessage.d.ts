/// <reference types="node" />
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class TestMessageMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    TestBlock1: {
        Test1: number;
    };
    NeighborBlock: {
        Test0: number;
        Test1: number;
        Test2: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
