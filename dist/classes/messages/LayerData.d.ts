/// <reference types="node" />
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class LayerDataMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    LayerID: {
        Type: number;
    };
    LayerData: {
        Data: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
