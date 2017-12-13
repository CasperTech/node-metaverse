/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ParcelSalesMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    ParcelData: {
        ParcelID: UUID;
        BuyerID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
