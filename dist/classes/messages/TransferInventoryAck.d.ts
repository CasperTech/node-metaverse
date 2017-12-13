/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class TransferInventoryAckMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    InfoBlock: {
        TransactionID: UUID;
        InventoryID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
