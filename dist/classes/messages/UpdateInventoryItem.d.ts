/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class UpdateInventoryItemMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        TransactionID: UUID;
    };
    InventoryData: {
        ItemID: UUID;
        FolderID: UUID;
        CallbackID: number;
        CreatorID: UUID;
        OwnerID: UUID;
        GroupID: UUID;
        BaseMask: number;
        OwnerMask: number;
        GroupMask: number;
        EveryoneMask: number;
        NextOwnerMask: number;
        GroupOwned: boolean;
        TransactionID: UUID;
        Type: number;
        InvType: number;
        Flags: number;
        SaleType: number;
        SalePrice: number;
        Name: Buffer;
        Description: Buffer;
        CreationDate: number;
        CRC: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
