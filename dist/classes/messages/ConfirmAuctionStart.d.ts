/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ConfirmAuctionStartMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AuctionData: {
        ParcelID: UUID;
        AuctionID: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
