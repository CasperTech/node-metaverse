/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class LinkInventoryItemMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    InventoryBlock: {
        CallbackID: number;
        FolderID: UUID;
        TransactionID: UUID;
        OldItemID: UUID;
        Type: number;
        InvType: number;
        Name: Buffer;
        Description: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
