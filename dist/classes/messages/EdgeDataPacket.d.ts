/// <reference types="node" />
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class EdgeDataPacketMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    EdgeData: {
        LayerType: number;
        Direction: number;
        LayerData: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
