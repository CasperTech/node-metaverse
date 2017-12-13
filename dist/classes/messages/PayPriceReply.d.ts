/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class PayPriceReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    ObjectData: {
        ObjectID: UUID;
        DefaultPayPrice: number;
    };
    ButtonData: {
        PayButton: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
